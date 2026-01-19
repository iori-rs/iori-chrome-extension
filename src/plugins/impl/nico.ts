import type { StreamMetadata } from "~src/types"

import type { IoriPlugin, PluginExecuteResult } from "../types"
import { getCookie } from "../utils"

export class NicoPlugin implements IoriPlugin {
  name = "Nico Plugin"
  description = "Plugin for Nicovideo"

  match(pageUrl: string): boolean {
    return pageUrl.includes("live.nicovideo.jp")
  }

  async process(streamUrl?: string): Promise<PluginExecuteResult> {
    const metadata: StreamMetadata = {}
    const pageUrl = window.location.href.split("?")[0]

    const titleEl = document.querySelector(`h1[class^=___program-title]`)

    if (titleEl) {
      metadata.title = titleEl.textContent
    }

    const cookieValue = await getCookie("user_session")

    if (cookieValue) {
      metadata.cliArgs = { "--nico-user-session": cookieValue }
    }

    return { metadata, rewrittenUrl: pageUrl }
  }
}
