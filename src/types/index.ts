export interface MediaStream {
  url: string;
  timestamp: number;
}

export interface UserSettings {
  concurrency?: number;
  timeout?: number;
  segmentRetries?: number;
  inMemoryCache?: boolean;
  noMerge?: boolean;
  userAgent?: string;
}
