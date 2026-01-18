import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
  run_at: "document_start"
}

// Listen for messages from the injected script
window.addEventListener("message", (event) => {
  if (event.source !== window) return

  if (event.data?.type === "IORI_HLS_FOUND" && event.data?.url) {
    console.log("[IORI] Content script received HLS URL:", event.data.url)
    chrome.runtime.sendMessage({
      type: "SAVE_MEDIA_STREAM",
      url: event.data.url
    })
  }
})
