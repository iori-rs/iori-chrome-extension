import { Button } from "@base-ui/react/button"
import { Check, ChevronDown, Copy, Film } from "lucide-react"
import { useState } from "react"

import { useClipboard } from "../../hooks/useClipboard"
import { getPluginOptionsForUrl } from "../../plugins"
import type { MediaStream, UserSettings } from "../../types"
import { generateShioriCommand } from "../../utils/command"
import { getFileExtension } from "../../utils/tool"
import { StreamOptions } from "./StreamOptions"

import "./style.css"

interface StreamCardProps {
  stream: MediaStream
  settings: UserSettings
  pageUrl: string
}

export function StreamCard({ stream, settings, pageUrl }: StreamCardProps) {
  const [showCommand, setShowCommand] = useState(true)
  const [showOptions, setShowOptions] = useState(false)
  const [pluginOptions, setPluginOptions] = useState<Record<string, string | boolean>>({})
  const { copied, copy } = useClipboard()
  const extension = getFileExtension(stream.url)

  // Get plugin options based on current page URL
  const availableOptions = getPluginOptionsForUrl(pageUrl)
  const hasOptions = availableOptions.length > 0

  // Initialize plugin options with default values
  const initializeOptions = (): Record<string, string | boolean> => {
    const initialized: Record<string, string | boolean> = {}
    availableOptions.forEach((option) => {
      initialized[option.key] = option.defaultValue
    })
    return initialized
  }

  // Generate command with current plugin options
  const command = generateShioriCommand(
    stream,
    settings,
    hasOptions ? { ...initializeOptions(), ...pluginOptions } : undefined
  )

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    copy(command)
  }

  const toggleDisplay = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowCommand((prev) => !prev)
  }

  const toggleOptions = () => {
    if (hasOptions) {
      setShowOptions((prev) => !prev)
    }
  }

  const handleOptionChange = (key: string, value: string | boolean) => {
    setPluginOptions((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const displayContent = showCommand ? command : stream.url

  return (
    <div
      className="stream-card"
      onClick={toggleOptions}
      style={{ cursor: hasOptions ? "pointer" : "default" }}>
      <div className="stream-header">
        <div className="stream-info-left">
          <Film size={14} className="stream-icon" />
          <span className={`badge badge-${extension.toLowerCase()}`}>
            {extension}
          </span>
        </div>
        <span className="stream-title">{stream.metadata?.title || ""}</span>
        {hasOptions && (
          <button
            title={showOptions ? "隐藏选项" : "显示选项"}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
              marginLeft: "4px",
              transform: showOptions ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s"
            }}>
            <ChevronDown size={16} />
          </button>
        )}
      </div>

      <div
        className="stream-url"
        title={displayContent}
        onClick={toggleDisplay}
        style={{ cursor: "pointer" }}>
        {displayContent}
      </div>

      {showOptions && (
        <StreamOptions
          availableOptions={availableOptions}
          values={pluginOptions}
          onChange={handleOptionChange}
        />
      )}

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
