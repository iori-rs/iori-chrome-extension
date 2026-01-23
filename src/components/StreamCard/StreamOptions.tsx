import type { PluginOption } from "../../plugins/types"

interface StreamOptionsProps {
  availableOptions: PluginOption[]
  values: Record<string, string | boolean>
  onChange: (key: string, value: string | boolean) => void
}

export function StreamOptions({
  availableOptions,
  values,
  onChange
}: StreamOptionsProps) {
  if (availableOptions.length === 0) return null

  return (
    <div className="plugin-options" onClick={(e) => e.stopPropagation()}>
          {availableOptions.map((option) => (
            <div key={option.key} className="option-item">
              {option.type === "boolean" ? (
                <label className="option-checkbox">
                  <input
                    type="checkbox"
                    checked={
                      (typeof values[option.key] === "boolean"
                        ? values[option.key]
                        : option.defaultValue) as boolean
                    }
                    onChange={(e) => onChange(option.key, e.target.checked)}
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
                      (typeof values[option.key] === "string"
                        ? values[option.key]
                        : option.defaultValue) as string
                    }
                    onChange={(e) => onChange(option.key, e.target.value)}
                    placeholder={option.description}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
  )
}
