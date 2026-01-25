export interface StreamMetadata {
  /**
   * Extracted page title or specific element text usually used for filename
   */
  title?: string
  /**
   * Header fields including User-Agent and Referer
   */
  headers?: Record<string, string>
  /**
   * Additional CLI arguments
   */
  cliArgs?: Record<string, string>
}

export interface MediaStream {
  url: string
  timestamp: number
  metadata?: StreamMetadata
}

export interface UserSettings {
  concurrency?: number
  timeout?: number
  segmentRetries?: number
  manifestRetries?: number
  inMemoryCache?: boolean
  noMerge?: boolean
  userAgent?: string
  streamSortOrder?: "asc" | "desc"
}

// --- Message Types ---

// 1. Window Messages (Main World -> Content Script)
export type WindowMessageType = "IORI_HLS_FOUND"

export interface WindowMessageHlsFound {
  type: "IORI_HLS_FOUND"
  url: string
}

export type IoriWindowMessage = WindowMessageHlsFound

// 2. Extension Runtime Messages (Content Script <-> Background)
export type RuntimeMessageType = "SAVE_MEDIA_STREAM" | "EXTRACT_METADATA"

export interface MsgSaveMediaStream {
  type: "SAVE_MEDIA_STREAM"
  url: string
  metadata?: StreamMetadata
}

export interface MsgExtractMetadata {
  type: "EXTRACT_METADATA"
  url?: string
}

export interface MsgGetCookie {
  type: "GET_COOKIE"
  name: string
}

export type IoriRuntimeMessage =
  | MsgSaveMediaStream
  | MsgExtractMetadata
  | MsgGetCookie
