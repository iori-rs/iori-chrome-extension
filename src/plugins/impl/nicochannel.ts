import type { IoriPlugin, PluginExecuteResult } from "../types"

export class NicoChannelPlugin implements IoriPlugin {
  name = "Nico Channel Plugin"
  description = "Plugin for Nico channel"

  match(pageUrl: string): boolean {
    return pageUrl.includes("nicochannel.jp") || pageUrl.includes("qlover.jp")
  }

  async process(streamUrl?: string): Promise<PluginExecuteResult> {
    const pageUrl = window.location.href.split("?")[0]
    return {
      metadata: {
        title: document.title
      },
      rewrittenUrl: pageUrl
    }
  }
}
