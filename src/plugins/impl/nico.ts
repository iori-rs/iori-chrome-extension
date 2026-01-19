import type { MsgGetCookie, StreamMetadata } from "~src/types"

import type { IoriPlugin } from "../types"

export class NicoPlugin implements IoriPlugin {
  name = "Nico Plugin"
  description = "Plugin for Nicovideo"

  match(pageUrl: string): boolean {
    return pageUrl.includes("live.nicovideo.jp")
  }

  async extractMetadata(streamUrl?: string): Promise<StreamMetadata> {
    const metadata: StreamMetadata = {}

    const titleEl = document.querySelector(`h1[class^=___program-title]`)

    if (titleEl) {
      metadata.title = titleEl.textContent
    }

    try {
      const cookieValue = await chrome.runtime.sendMessage<
        MsgGetCookie,
        string | undefined
      >({
        type: "GET_COOKIE",
        name: "user_session"
      })

      if (cookieValue) {
        metadata.cliArgs = { "--nico-user-session": cookieValue }
      }
    } catch (e) {
      console.warn("[Nico Plugin] Failed to fetch session cookie", e)
    }

    return metadata
  }
}
