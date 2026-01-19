export interface StreamMetadata {
  /**
   * Extracted page title or specific element text usually used for filename
   */
  title?: string
  /**
   * Header fields including User-Agent and Referer
   */
  headers?: Record<string, string>
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
  inMemoryCache?: boolean
  noMerge?: boolean
  userAgent?: string
}
