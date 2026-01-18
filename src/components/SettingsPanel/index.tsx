import { ChevronLeft } from "lucide-react"
import { Button } from "@base-ui/react/button"
import type { UserSettings } from "../../types"
import "./style.css"

interface SettingsPanelProps {
  settings: UserSettings
  onUpdate: (settings: Partial<UserSettings>) => void
  onBack: () => void
}

export function SettingsPanel({
  settings,
  onUpdate,
  onBack
}: SettingsPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <Button onClick={onBack} className="back-button">
          <ChevronLeft size={20} />
          返回
        </Button>
        <h3>设置</h3>
      </div>

      <div className="settings-content">
        <div className="form-group">
          <label htmlFor="concurrency">下载并发数</label>
          <input
            id="concurrency"
            type="number"
            min="1"
            max="32"
            value={settings.concurrency || 5}
            onChange={(e) =>
              onUpdate({ concurrency: parseInt(e.target.value, 10) })
            }
            className="settings-input"
          />
          <span className="help-text">
            设置 shiori 下载时的并发连接数 (默认为 5)
          </span>
        </div>
      </div>
    </div>
  )
}
