import { Button } from "@base-ui/react/button"
import { Check, Copy, Film } from "lucide-react"

import { useClipboard } from "../../hooks/useClipboard"
import { formatTimestamp, getFileExtension } from "../../lib/utils"
import type { MediaStream } from "../../types"
import "./style.css"

interface StreamCardProps {
  stream: MediaStream
}

export function StreamCard({ stream }: StreamCardProps) {
  const { copied, copy } = useClipboard()
  const extension = getFileExtension(stream.url)

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
        onClick={() => copy(`shiori dl "${stream.url}"`)}
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
