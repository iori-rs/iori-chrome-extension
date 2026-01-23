import type { StreamMetadata } from "~src/types"

export interface PluginExecuteResult {
  metadata: StreamMetadata
  rewrittenUrl?: string
}

export type PluginOptionType = "string" | "boolean"

export interface PluginOption {
  /**
   * CLI flag key (e.g., "nico-download-danmaku")
   */
  key: string
  /**
   * Human-readable label for the UI
   */
  label: string
  /**
   * Option type - determines the input control
   */
  type: PluginOptionType
  /**
   * Default value for the option
   */
  defaultValue: string | boolean
  /**
   * Optional description or help text
   */
  description?: string
}

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
   * Process the stream URL and extract metadata from the current page content
   * This runs in the content script context (DOM access available)
   */
  process: (streamUrl?: string) => Promise<PluginExecuteResult>
  /**
   * Optional: Return configurable options for this plugin
   * These options will be displayed in the stream card UI
   */
  getOptions?: () => PluginOption[]
}
