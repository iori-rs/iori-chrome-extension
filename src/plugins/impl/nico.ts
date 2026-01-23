import type { StreamMetadata } from "~src/types"

import type { IoriPlugin, PluginExecuteResult, PluginOption } from "../types"
import { getCookie } from "../utils"

export class NicoPlugin implements IoriPlugin {
  name = "Nico Plugin"
  description = "Plugin for Nicovideo"

  match(pageUrl: string): boolean {
    return (
      pageUrl.includes("live.nicovideo.jp") ||
      pageUrl.includes("nicovideo.jp/watch")
    )
  }

  getOptions(): PluginOption[] {
    return [
      {
        key: "nico-download-danmaku",
        label: "下载弹幕",
        type: "boolean",
        defaultValue: false,
        description: "同时下载弹幕文件"
      },
      {
        key: "nico-chase-play",
        label: "追播模式",
        type: "boolean",
        defaultValue: false,
        description: "从头开始下载正在进行的直播"
      },
      {
        key: "nico-reserve-timeshift",
        label: "自动预约时移",
        type: "boolean",
        defaultValue: false,
        description: "如果未预约，自动预约时移"
      },
      {
        key: "nico-danmaku-only",
        label: "仅下载弹幕",
        type: "boolean",
        defaultValue: false,
        description: "仅下载弹幕，不下载视频"
      }
    ]
  }

  async process(streamUrl?: string): Promise<PluginExecuteResult> {
    const metadata: StreamMetadata = {}
    const pageUrl = window.location.href.split("?")[0]

    const titleEl = document.querySelector(`h1[class^=___program-title]`)

    if (titleEl) {
      metadata.title = titleEl.textContent
    } else {
      metadata.title = document.title.split("-")[0].trim()
    }

    const cookieValue = await getCookie("user_session")

    if (cookieValue) {
      metadata.cliArgs = { "--nico-user-session": cookieValue }
    }

    return { metadata, rewrittenUrl: pageUrl }
  }
}
