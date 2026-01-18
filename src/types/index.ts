export interface MediaStream {
  url: string
  timestamp: number
  metadata?: import("../plugins/types").StreamMetadata
}

export interface UserSettings {
  concurrency?: number;
  timeout?: number;
  segmentRetries?: number;
  inMemoryCache?: boolean;
  noMerge?: boolean;
  userAgent?: string;
}
