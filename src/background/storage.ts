import type { MediaStream, StreamMetadata } from "~src/types"

interface StorageData {
  [tabId: string]: MediaStream[]
}

// Storage key prefix
export const STORAGE_PREFIX = "media_streams_"

/**
 * Get storage key for a specific tab
 */
export function getStorageKey(tabId: number): string {
  return `${STORAGE_PREFIX}${tabId}`
}

/**
 * Save media stream URL to storage
 */
export async function saveMediaStream(
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
export async function clearTabStreams(tabId: number): Promise<void> {
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
export async function cleanStaleData(): Promise<void> {
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
