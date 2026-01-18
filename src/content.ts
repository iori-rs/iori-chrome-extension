import type { PlasmoCSConfig } from "plasmo"

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
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "EXTRACT_METADATA") {
    extractPageMetadata().then((metadata) => {
        sendResponse(metadata)
    })
    return true // Keep channel open for async response
  }
})

// Listen for messages from the injected script
window.addEventListener("message", async (event) => {
  if (event.source !== window) return

  if (event.data?.type === "IORI_HLS_FOUND" && event.data?.url) {
    console.log("[IORI] Content script received HLS URL:", event.data.url)
    
    const metadata = await extractPageMetadata()

    chrome.runtime.sendMessage({
      type: "SAVE_MEDIA_STREAM",
      url: event.data.url,
      metadata
    })
  }
})
