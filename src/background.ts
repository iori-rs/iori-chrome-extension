// Background Service Worker for media stream sniffing
export {}

// Types for our storage structure
interface MediaStream {
  url: string
  timestamp: number
}

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
    
    // Check for .m3u8 or .mpd extensions
    return pathname.endsWith(".m3u8") || pathname.endsWith(".mpd")
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
async function saveMediaStream(tabId: number, url: string): Promise<void> {
  if (tabId < 0) return // Ignore invalid tab IDs
  
  const storageKey = getStorageKey(tabId)
  
  try {
    // Get existing streams for this tab
    const result = await chrome.storage.local.get(storageKey)
    const existingStreams: MediaStream[] = result[storageKey] || []
    
    // Check if URL already exists to avoid duplicates
    const urlExists = existingStreams.some(stream => stream.url === url)
    
    if (!urlExists) {
      const newStream: MediaStream = {
        url,
        timestamp: Date.now()
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

// Listen to web requests for media streams
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const { url, tabId } = details
    
    // Check if this is a media stream URL
    if (isMediaStream(url)) {
      saveMediaStream(tabId, url)
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
