import type { PlasmoCSConfig } from "plasmo"

import type {
  IoriRuntimeMessage,
  IoriWindowMessage,
  StreamMetadata
} from "~src/types"

import { getPlugin } from "./plugins"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
  run_at: "document_start"
}

// Helper to extract metadata
async function extractPageMetadata() {
  const plugin = getPlugin(window.location.href)
  if (plugin) {
    try {
      console.log(`[IORI] Running plugin: ${plugin.name}`)
      return await plugin.extractMetadata()
    } catch (e) {
      console.error("[IORI] Plugin execution failed:", e)
    }
  }
  // Default metadata extraction if no plugin matches
  return {
    title: document.title
  }
}

// Listen for requests from background script (DASH detection logic triggers this)
chrome.runtime.onMessage.addListener(
  (message: IoriRuntimeMessage, sender, sendResponse) => {
    if (message.type === "EXTRACT_METADATA") {
      extractPageMetadata().then((metadata) => {
        sendResponse(metadata)
      })
      return true // Keep channel open for async response
    }
  }
)

// Listen for messages from the injected script
window.addEventListener("message", async (event) => {
  if (event.source !== window) return

  const data = event.data as IoriWindowMessage

  if (data?.type === "IORI_HLS_FOUND" && data?.url) {
    console.log("[IORI] Content script received HLS URL:", data.url)

    const metadata = await extractPageMetadata()

    const msg: IoriRuntimeMessage = {
      type: "SAVE_MEDIA_STREAM",
      url: data.url,
      metadata
    }

    chrome.runtime.sendMessage(msg)
  }
})
