import { Button } from "@base-ui/react/button"
import { Check, Copy, Film } from "lucide-react"

import { useClipboard } from "../../hooks/useClipboard"
import type { MediaStream, UserSettings } from "../../types"
import { generateShioriCommand } from "../../utils/command"
import { formatTimestamp, getFileExtension } from "../../utils/tool"

import "./style.css"

interface StreamCardProps {
  stream: MediaStream
  settings: UserSettings
}

export function StreamCard({ stream, settings }: StreamCardProps) {
  const { copied, copy } = useClipboard()
  const extension = getFileExtension(stream.url)

  const handleCopy = () => {
    const command = generateShioriCommand(stream, settings)
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
