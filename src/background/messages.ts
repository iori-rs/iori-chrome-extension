import type { IoriRuntimeMessage } from "~src/types"

import { saveMediaStream } from "./storage"

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
