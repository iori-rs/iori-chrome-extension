import { Button } from "@base-ui/react/button"
import { Check, ChevronDown, ChevronUp, Copy, Film } from "lucide-react"
import { useState } from "react"

import { useClipboard } from "../../hooks/useClipboard"
import { getPluginOptionsForUrl } from "../../plugins"
import type { MediaStream, UserSettings } from "../../types"
import { generateShioriCommand } from "../../utils/command"
import { getFileExtension } from "../../utils/tool"

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

  const handleCopy = () => {
    copy(command)
  }

  const toggleDisplay = () => {
    setShowCommand((prev) => !prev)
  }

  const toggleOptions = () => {
    setShowOptions((prev) => !prev)
  }

  const handleOptionChange = (key: string, value: string | boolean) => {
    setPluginOptions((prev) => ({
      ...prev,
      [key]: value
    }))
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

      {hasOptions && (
        <button className="options-toggle" onClick={toggleOptions}>
          {showOptions ? (
            <>
              <ChevronUp size={14} /> 隐藏选项
            </>
          ) : (
            <>
              <ChevronDown size={14} /> 显示选项
            </>
          )}
        </button>
      )}

      {hasOptions && showOptions && (
        <div className="plugin-options">
          {availableOptions.map((option) => (
            <div key={option.key} className="option-item">
              {option.type === "boolean" ? (
                <label className="option-checkbox">
                  <input
                    type="checkbox"
                    checked={
                      (typeof pluginOptions[option.key] === "boolean"
                        ? pluginOptions[option.key]
                        : option.defaultValue) as boolean
                    }
                    onChange={(e) =>
                      handleOptionChange(option.key, e.target.checked)
                    }
                  />
                  <div className="option-checkbox-content">
                    <span className="option-label">{option.label}</span>
                    {option.description && (
                      <span className="option-description">
                        {option.description}
                      </span>
                    )}
                  </div>
                </label>
              ) : (
                <label className="option-text">
                  <span className="option-label">{option.label}</span>
                  <input
                    type="text"
                    value={
                      (typeof pluginOptions[option.key] === "string"
                        ? pluginOptions[option.key]
                        : option.defaultValue) as string
                    }
                    onChange={(e) =>
                      handleOptionChange(option.key, e.target.value)
                    }
                    placeholder={option.description}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
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
