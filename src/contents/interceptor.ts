import type { PlasmoCSConfig } from "plasmo"

import type { IoriWindowMessage } from "~src/types"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  world: "MAIN",
  run_at: "document_start"
}

console.log("[IORI] Interceptor injected (Main World)")

const isMasterPlaylist = (content: string) => {
  return content.includes("#EXT-X-STREAM-INF")
}

// Intercept Fetch
const { fetch: originalFetch } = window
window.fetch = async (...args) => {
  const [resource] = args
  const response = await originalFetch(...args)

  const url = response.url || (typeof resource === "string" ? resource : (resource as Request).url)
  
  // Only check m3u8 files
  if (url && url.includes(".m3u8")) {
    console.log("[IORI] Intercepted Fetch for .m3u8:", url)
    try {
      const clone = response.clone()
      clone.text().then((content) => {
        if (isMasterPlaylist(content)) {
          console.log("[IORI] Found Master Playlist (Fetch):", url)
          const msg: IoriWindowMessage = { type: "IORI_HLS_FOUND", url }
          window.postMessage(msg, "*")
        } else {
          console.log("[IORI] Ignored Segment/Other Playlist (Fetch):", url)
        }
      }).catch((err) => {
        console.warn("[IORI] Failed to read body of:", url, err)
      })
    } catch (e) {
      console.warn("[IORI] Error cloning response:", url, e)
    }
  }

  return response
}

// Intercept XHR
const XHR = XMLHttpRequest.prototype
const open = XHR.open
const send = XHR.send

XHR.open = function (method: string, url: string | URL) {
  this._url = typeof url === "string" ? url : url.toString()
  return open.apply(this, arguments as any)
}

XHR.send = function (body) {
  this.addEventListener("load", () => {
    const url = this.responseURL || this._url
    if (url && url.includes(".m3u8")) {
      console.log("[IORI] Intercepted XHR for .m3u8:", url)
      if (this.responseText && isMasterPlaylist(this.responseText)) {
        console.log("[IORI] Found Master Playlist (XHR):", url)
        const msg: IoriWindowMessage = { type: "IORI_HLS_FOUND", url }
        window.postMessage(msg, "*")
      } else {
        console.log("[IORI] Ignored Segment/Other Playlist (XHR):", url)
      }
    }
  })
  return send.apply(this, arguments as any)
}
