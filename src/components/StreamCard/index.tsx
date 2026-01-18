import { Button } from "@base-ui/react/button"
import { Check, Copy, Film } from "lucide-react"

import { useClipboard } from "../../hooks/useClipboard"
import { formatTimestamp, getFileExtension } from "../../lib/utils"
import type { MediaStream, UserSettings } from "../../types"

import "./style.css"

interface StreamCardProps {
  stream: MediaStream
  settings: UserSettings
}

export function StreamCard({ stream, settings }: StreamCardProps) {
  const { copied, copy } = useClipboard()
  const extension = getFileExtension(stream.url)

  const handleCopy = () => {
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

    // Handle User Agent: Plugin metadata > Settings > Default
    const metadataUA = stream.metadata?.userAgent
    const settingsUA = settings.userAgent

    if (metadataUA) {
      const safeUA = metadataUA.replace(/"/g, '\\"')
      command += ` -H "User-Agent: ${safeUA}"`
    } else if (settingsUA && settingsUA.trim().length > 0) {
      // Escape double quotes in user agent just in case
      const safeUA = settingsUA.replace(/"/g, '\\"')
      command += ` -H "User-Agent: ${safeUA}"`
    }

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

    copy(command)
  }

  return (
    <div className="stream-card">
      <div className="stream-header">
        <div className="stream-info-left">
          <Film size={14} className="stream-icon" />
          <span className={`badge badge-${extension.toLowerCase()}`}>
            {extension}
          </span>
        </div>
        <span className="stream-timestamp">
          {formatTimestamp(stream.timestamp)}
        </span>
      </div>

      <div className="stream-url" title={stream.url}>
        {stream.url}
      </div>

      <Button
        onClick={handleCopy}
        className={`copy-button ${copied ? "copied" : ""}`}>
        {copied ? (
          <>
            <Check size={14} /> 已复制
          </>
        ) : (
          <>
            <Copy size={14} /> 复制命令
          </>
        )}
      </Button>
    </div>
  )
}
