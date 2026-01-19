import type { MediaStream, UserSettings } from "../types"

/**
 * Generates a shiori CLI command based on the media stream and user settings.
 *
 * @param stream The media stream object containing URL and metadata
 * @param settings The user's configuration settings
 * @returns A string representing the shiori command
 */
export function generateShioriCommand(stream: MediaStream, settings: UserSettings): string {
  let command = `shiori dl "${stream.url}"`

  // Optional settings - only append if different from CLI defaults or explicitly enabled
  if (settings.concurrency && settings.concurrency !== 5) {
    command += ` --concurrency ${settings.concurrency}`
  }

  if (settings.timeout && settings.timeout !== 10) {
    command += ` --timeout ${settings.timeout}`
  }

  if (settings.segmentRetries && settings.segmentRetries !== 5) {
    command += ` --segment-retries ${settings.segmentRetries}`
  }

  if (settings.noMerge) {
    command += ` --no-merge`
  }

  if (settings.inMemoryCache) {
    command += ` --in-memory-cache`
  }

  // Handle Headers (User-Agent, Referer, etc)
  // Priority: stream.metadata.headers > settings
  const finalHeaders: Record<string, string> = {}

  // 1. Apply settings headers
  if (settings.userAgent && settings.userAgent.trim().length > 0) {
    finalHeaders["user-agent"] = settings.userAgent
  }

  // 2. Apply metadata headers (overwrite settings)
  // Ensure keys are lowercased for consistent merging
  if (stream.metadata?.headers) {
    Object.entries(stream.metadata.headers).forEach(([key, value]) => {
      finalHeaders[key.toLowerCase()] = value
    })
  }

  // 3. Append headers to command
  Object.entries(finalHeaders).forEach(([key, value]) => {
    command += ` -H "${key}: ${value.replace(/"/g, '\\"')}"`
  })

  // Handle Output Filename from Metadata
  if (stream.metadata?.title) {
    // Simple sanitization to prevent command injection or invalid filenames
    const safeTitle = stream.metadata.title
      .replace(/[\\/:*?"<>|\r\n]/g, "_")
      .trim()
    if (safeTitle.length > 0) {
      command += ` --output "${safeTitle}"`
    }
  }

  return command
}
