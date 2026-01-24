import { Button } from "@base-ui/react/button"
import { Check, ChevronDown, Copy, Film, Link } from "lucide-react"
import { useState } from "react"

import { useClipboard } from "../../hooks/useClipboard"
import { usePluginOptions } from "../../hooks/usePluginOptions"
import { getPlugin } from "../../plugins"
import type { MediaStream, UserSettings } from "../../types"
import { generateShioriCommand } from "../../utils/command"
import { getFileExtension } from "../../utils/tool"
import { StreamOptions } from "./StreamOptions"

import "./style.css"

interface StreamCardProps {
  stream: MediaStream
  settings: UserSettings
  pageUrl: string
  defaultExpanded?: boolean
}

export function StreamCard({
  stream,
  settings,
  pageUrl,
  defaultExpanded = false
}: StreamCardProps) {
  // Get plugin options based on current page URL
  const plugin = getPlugin(pageUrl)
  const availableOptions = plugin?.getOptions?.() || []
  const hasOptions = availableOptions.length > 0

  const [showOptions, setShowOptions] = useState(defaultExpanded && hasOptions)
  const [isCommandExpanded, setIsCommandExpanded] = useState(false)
  const { options: pluginOptions, updateOption } = usePluginOptions(
    plugin?.name,
    availableOptions
  )
  const { copied: commandCopied, copy: copyCommand } = useClipboard()
  const { copied: urlCopied, copy: copyUrl } = useClipboard()
  const extension = getFileExtension(stream.url)

  // Generate command with current plugin options
  const command = generateShioriCommand(
    stream,
    settings,
    hasOptions ? pluginOptions : undefined
  )

  const handleCopyCommand = (e: React.MouseEvent) => {
    e.stopPropagation()
    copyCommand(command)
  }

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation()
    copyUrl(stream.url)
  }

  const handleCommandClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isCommandExpanded) {
      setIsCommandExpanded(true)
    } else {
      copyCommand(command)
    }
  }

  const toggleOptions = () => {
    if (hasOptions) {
      setShowOptions((prev) => !prev)
    }
  }

  const handleOptionChange = (key: string, value: string | boolean) => {
    updateOption(key, value)
  }

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
        className={`stream-command ${isCommandExpanded ? "expanded" : ""}`}
        title={command}
        onClick={handleCommandClick}>
        {command}
      </div>

      {showOptions && (
        <StreamOptions
          availableOptions={availableOptions}
          values={pluginOptions}
          onChange={handleOptionChange}
        />
      )}

      <div style={{ display: "flex", gap: "8px" }}>
        <Button
          onClick={handleCopyCommand}
          className={`copy-button ${commandCopied ? "copied" : ""}`}
          style={{ flex: 1 }}>
          {commandCopied ? (
            <>
              <Check size={14} /> 已复制
            </>
          ) : (
            <>
              <Copy size={14} /> 复制命令
            </>
          )}
        </Button>
        <Button
          onClick={handleCopyUrl}
          className={`copy-button ${urlCopied ? "copied" : ""}`}
          style={{ flex: 1 }}>
          {urlCopied ? (
            <>
              <Check size={14} /> 已复制
            </>
          ) : (
            <>
              <Link size={14} /> 复制链接
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
