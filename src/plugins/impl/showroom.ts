import type { StreamMetadata } from "~src/types"

import type { IoriPlugin, PluginExecuteResult } from "../types"
import { getCookie } from "../utils"

export class ShowroomPlugin implements IoriPlugin {
  name = "Showroom Plugin"
  description = "Plugin for Showroom domain"

  match(pageUrl: string): boolean {
    return pageUrl.includes("showroom-live.com")
  }

  async process(streamUrl?: string): Promise<PluginExecuteResult> {
    const metadata: StreamMetadata = {}

    const titleEl = document.querySelector("title")
    const pageUrl = window.location.href.split("?")[0]

    const isLogin = !!document.querySelector(".st-sidemenu__profile-name")

    if (titleEl) {
      metadata.title = document
        .querySelector("title")
        .textContent.split("｜")[0]
    }

    const cookieValue = await getCookie("sr_id")

    if (isLogin && cookieValue) {
      metadata.cliArgs = { "--showroom-user-session": cookieValue }
    }

    return { metadata, rewrittenUrl: pageUrl }
  }
}
