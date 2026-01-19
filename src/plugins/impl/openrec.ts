import type { StreamMetadata } from "~src/types"
import type { IoriPlugin } from "../types"

export class OpenrecPlugin implements IoriPlugin {
  name = "Openrec Plugin"
  description = "Plugin for Openrec domain"

  match(pageUrl: string): boolean {
    return pageUrl.includes("openrec.tv")
  }

  async extractMetadata(streamUrl?: string): Promise<StreamMetadata> {
    const metadata: StreamMetadata = {}

    const titleEl = document.querySelector("title")
    if (titleEl) {
      metadata.title = document.querySelector("title").textContent.split("|")[0]
    }

    return metadata
  }
}
