import { Button } from "@base-ui/react/button"
import { Check, Copy, Film } from "lucide-react"
import { useState } from "react"

import { useClipboard } from "../../hooks/useClipboard"
import type { MediaStream, UserSettings } from "../../types"
import { generateShioriCommand } from "../../utils/command"
import { getFileExtension } from "../../utils/tool"

import "./style.css"

interface StreamCardProps {
  stream: MediaStream
  settings: UserSettings
}

export function StreamCard({ stream, settings }: StreamCardProps) {
  const [showCommand, setShowCommand] = useState(true)
  const { copied, copy } = useClipboard()
  const extension = getFileExtension(stream.url)
  const command = generateShioriCommand(stream, settings)

  const handleCopy = () => {
    copy(command)
  }

  const toggleDisplay = () => {
    setShowCommand((prev) => !prev)
  }

  const displayContent = showCommand ? command : stream.url

  return (
    <div className="stream-card">
      <div className="stream-header">
        <div className="stream-info-left">
          <Film size={14} className="stream-icon" />
          <span className={`badge badge-${extension.toLowerCase()}`}>
            {extension}
          </span>
        </div>
        <span className="stream-title">{stream.metadata?.title || ""}</span>
      </div>

      <div
        className="stream-url"
        title={displayContent}
        onClick={toggleDisplay}
        style={{ cursor: "pointer" }}>
        {displayContent}
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
