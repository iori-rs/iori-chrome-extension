import type { IoriPlugin, PluginExecuteResult } from "../types"

export class RadikoPlugin implements IoriPlugin {
  name = "Radiko Plugin"
  description = "Plugin for Radiko.jp"

  match(pageUrl: string): boolean {
    return pageUrl.includes("radiko.jp")
  }

  async process(streamUrl?: string): Promise<PluginExecuteResult> {
    const pageUrl = window.location.href.split("?")[0]

    return {
      metadata: {
        title: document.title?.replace?.("| radiko", "")
      },
      rewrittenUrl: pageUrl
    }
  }
}
