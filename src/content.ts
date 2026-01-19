import type { PlasmoCSConfig } from "plasmo"

import type { PluginExecuteResult } from "~src/plugins/types"
import type { IoriRuntimeMessage, IoriWindowMessage } from "~src/types"

import { getPlugin } from "./plugins"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
  run_at: "document_start"
}

// Helper to execute plugin
async function executePlugin(streamUrl?: string): Promise<PluginExecuteResult> {
  const plugin = getPlugin(window.location.href)
  if (plugin) {
    try {
      console.log(`[IORI] Running plugin: ${plugin.name}`)
      return await plugin.process(streamUrl)
    } catch (e) {
      console.error("[IORI] Plugin execution failed:", e)
    }
  }
  // Default metadata extraction if no plugin matches
  return {
    metadata: {
      title: document.title
    }
  }
}

// Listen for requests from background script (DASH detection logic triggers this)
chrome.runtime.onMessage.addListener(
  (message: IoriRuntimeMessage, sender, sendResponse) => {
    if (message.type === "EXTRACT_METADATA") {
      executePlugin(message.url).then((result) => {
        sendResponse(result)
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

    const result = await executePlugin(data.url)

    const msg: IoriRuntimeMessage = {
      type: "SAVE_MEDIA_STREAM",
      url: result.rewrittenUrl || data.url,
      metadata: result.metadata
    }

    chrome.runtime.sendMessage(msg)
  }
})
