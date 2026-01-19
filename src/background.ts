import type { IoriRuntimeMessage, MediaStream, StreamMetadata } from "./types"

// Background Service Worker for media stream sniffing
export {}

interface StorageData {
  [tabId: string]: MediaStream[]
}

// Storage key prefix
const STORAGE_PREFIX = "media_streams_"

/**
 * Check if URL is a media stream by file extension
 */
function isMediaStream(url: string): boolean {
  try {
    // Remove query parameters and fragments to get the path
    const urlObj = new URL(url)
    const pathname = urlObj.pathname.toLowerCase()

    // Check for .mpd extensions (m3u8 is handled via content script interception)
    return pathname.endsWith(".mpd")
  } catch {
    return false
  }
}

/**
 * Get storage key for a specific tab
 */
function getStorageKey(tabId: number): string {
  return `${STORAGE_PREFIX}${tabId}`
}

/**
 * Save media stream URL to storage
 */
async function saveMediaStream(
  tabId: number,
  url: string,
  metadata?: StreamMetadata
): Promise<void> {
  if (tabId < 0) return // Ignore invalid tab IDs

  const storageKey = getStorageKey(tabId)

  try {
    // Get existing streams for this tab
    const result = await chrome.storage.local.get(storageKey)
    const existingStreams: MediaStream[] = result[storageKey] || []

    // Check if URL already exists to avoid duplicates
    const urlExists = existingStreams.some((stream) => stream.url === url)

    if (!urlExists) {
      const newStream: MediaStream = {
        url,
        timestamp: Date.now(),
        metadata
      }

      existingStreams.push(newStream)

      // Save back to storage
      await chrome.storage.local.set({
        [storageKey]: existingStreams
      })

      console.log(`[Media Sniffer] Captured stream for tab ${tabId}:`, url)
    }
  } catch (error) {
    console.error("[Media Sniffer] Error saving stream:", error)
  }
}

/**
 * Clear media streams for a specific tab
 */
async function clearTabStreams(tabId: number): Promise<void> {
  const storageKey = getStorageKey(tabId)

  try {
    await chrome.storage.local.remove(storageKey)
    console.log(`[Media Sniffer] Cleared streams for tab ${tabId}`)
  } catch (error) {
    console.error("[Media Sniffer] Error clearing streams:", error)
  }
}

/**
 * Clean up storage for tabs that no longer exist
 * This handles cases where the browser was closed inappropriately (crash, force quit)
 */
async function cleanStaleData(): Promise<void> {
  console.log("[Media Sniffer] Checking for stale data...")

  try {
    // Get all currently open tabs
    const tabs = await chrome.tabs.query({})
    const activeTabIds = new Set(tabs.map((t) => t.id))

    // Get all data from storage
    const allData = (await chrome.storage.local.get(
      null
    )) as unknown as StorageData
    const keysToRemove: string[] = []

    // Find keys that don't match any active tab
    for (const key of Object.keys(allData)) {
      if (key.startsWith(STORAGE_PREFIX)) {
        const tabId = parseInt(key.slice(STORAGE_PREFIX.length), 10)

        if (!isNaN(tabId) && !activeTabIds.has(tabId)) {
          keysToRemove.push(key)
        }
      }
    }

    if (keysToRemove.length > 0) {
      await chrome.storage.local.remove(keysToRemove)
      console.log(
        `[Media Sniffer] Removed ${keysToRemove.length} stale storage entries`
      )
    }
  } catch (error) {
    console.error("[Media Sniffer] Cleanup failed:", error)
  }
}

// Clean up stale data when the extension starts or updates
chrome.runtime.onStartup.addListener(cleanStaleData)
chrome.runtime.onInstalled.addListener(cleanStaleData)

// Listen for messages from content script
chrome.runtime.onMessage.addListener(
  (message: IoriRuntimeMessage, sender, sendResponse) => {
    if (message.type === "SAVE_MEDIA_STREAM" && sender.tab?.id) {
      console.log(
        `[Media Sniffer] Received stream URL from tab ${sender.tab.id}:`,
        message.url,
        message.metadata
      )
      saveMediaStream(sender.tab.id, message.url, message.metadata)
    } else if (message.type === "GET_COOKIE" && sender.tab?.url) {
      chrome.cookies
        .get({ url: sender.tab.url, name: message.name })
        .then((cookie) => sendResponse(cookie?.value))
        .catch((err) => {
          console.error("[Media Sniffer] Cookie fetch failed:", err)
          sendResponse(undefined)
        })
      return true
    }
  }
)

// Listen to web requests for media streams
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const { url, tabId } = details

    // Check if this is a media stream URL
    if (isMediaStream(url)) {
      // Attempt to fetch metadata from the tab before saving
      // Using a small timeout because the tab might be loading or content script not ready
      const tryFetchMetadata = async () => {
        try {
          const response = await chrome.tabs.sendMessage<
            IoriRuntimeMessage,
            StreamMetadata
          >(tabId, { type: "EXTRACT_METADATA", url })
          return response
        } catch {
          return undefined
        }
      }

      tryFetchMetadata().then((metadata) => {
        saveMediaStream(tabId, url, metadata)
      })
    }
  },
  {
    urls: ["<all_urls>"]
  }
)

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  clearTabStreams(tabId)
})

// Clean up when tab is refreshed/navigated
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  // Clear data when navigation starts (page refresh or new URL)
  if (changeInfo.status === "loading") {
    clearTabStreams(tabId)
  }
})

console.log("[Media Sniffer] Background service worker initialized")
