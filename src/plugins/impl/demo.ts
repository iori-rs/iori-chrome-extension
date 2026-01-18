import type { IoriPlugin, StreamMetadata } from "../types"

export class DemoPlugin implements IoriPlugin {
  name = "Demo Site Plugin"
  description = "Example plugin for a specific domain"

  match(pageUrl: string): boolean {
    return pageUrl.includes("example.com") || pageUrl.includes("test.com")
  }

  async extractMetadata(): Promise<StreamMetadata> {
    const metadata: StreamMetadata = {}

    // Example: Extract title from a specific h1 or title tag
    const titleEl =
      document.querySelector("h1.video-title") ||
      document.querySelector("title")
    if (titleEl) {
      metadata.title = titleEl.textContent?.trim()
    }

    // Example: Enforce a specific User-Agent for this site
    metadata.userAgent = "Mozilla/5.0 (Iori-Custom-Agent)"

    return metadata
  }
}
