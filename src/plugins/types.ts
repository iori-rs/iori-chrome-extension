import type { StreamMetadata } from "~src/types"

export interface IoriPlugin {
  /**
   * Name of the plugin
   */
  name: string
  /**
   * Description of what the plugin does
   */
  description?: string
  /**
   * Check if this plugin should run for the current page URL
   */
  match: (pageUrl: string) => boolean
  /**
   * Extract metadata from the current page content
   * This runs in the content script context (DOM access available)
   */
  extractMetadata: (streamUrl?: string) => Promise<StreamMetadata>
}
