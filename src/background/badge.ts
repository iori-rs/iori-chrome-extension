import type { MediaStream } from "~src/types"

import { STORAGE_PREFIX } from "./storage"

/**
 * Update the badge text and color for a specific tab based on the stream count.
 */
function updateBadge(tabId: number, streams: MediaStream[] | undefined) {
  const count = streams?.length || 0
  const text = count > 0 ? count.toString() : ""

  chrome.action
    .setBadgeText({
      text,
      tabId
    })
    .catch(() => {
      // Ignore error if tab doesn't exist (e.g. when tab is closed)
    })

  // Only set color if we are showing a badge, though it persists for the tab
  if (count > 0) {
    chrome.action
      .setBadgeBackgroundColor({
        color: "#3B82F6", // Blue
        tabId
      })
      .catch(() => {
        // Ignore error
      })
  }
}

/**
 * Listen for storage changes to update the badge count real-time.
 * This handles updates from:
 * 1. Stream detection (background)
 * 2. Clearing streams (popup)
 * 3. Tab navigation/removal (background tabs.ts)
 */
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") return

  for (const [key, { newValue }] of Object.entries(changes)) {
    if (key.startsWith(STORAGE_PREFIX)) {
      const tabIdStr = key.slice(STORAGE_PREFIX.length)
      const tabId = parseInt(tabIdStr, 10)

      if (!isNaN(tabId)) {
        updateBadge(tabId, newValue as MediaStream[] | undefined)
      }
    }
  }
})
