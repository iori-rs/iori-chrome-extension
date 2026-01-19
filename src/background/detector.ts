import type { PluginExecuteResult } from "~src/plugins/types"
import type { IoriRuntimeMessage } from "~src/types"

import { saveMediaStream } from "./storage"

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
            PluginExecuteResult
          >(tabId, { type: "EXTRACT_METADATA", url })
          return response
        } catch {
          return undefined
        }
      }

      tryFetchMetadata().then((result) => {
        if (result) {
          saveMediaStream(tabId, result.rewrittenUrl || url, result.metadata)
        } else {
          saveMediaStream(tabId, url, undefined)
        }
      })
    }
  },
  {
    urls: ["<all_urls>"]
  }
)
