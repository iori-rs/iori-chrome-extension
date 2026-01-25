import { Button } from "@base-ui/react/button"
import { ChevronLeft } from "lucide-react"

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
        <div className="settings-section">
          <h4 className="section-title">扩展设置</h4>
          <div className="form-group">
            <label htmlFor="streamSortOrder">媒体流列表排序</label>
            <select
              id="streamSortOrder"
              value={settings.streamSortOrder ?? "desc"}
              onChange={(e) =>
                onUpdate({ streamSortOrder: e.target.value as "asc" | "desc" })
              }
              className="settings-input">
              <option value="desc">时间倒序 (最新在前)</option>
              <option value="asc">时间正序 (最旧在前)</option>
            </select>
          </div>
        </div>
        <div className="settings-section">
          <h4 className="section-title">下载配置</h4>
          <div className="form-group">
            <label htmlFor="concurrency">并发数 (--concurrency)</label>
            <input
              id="concurrency"
              type="number"
              min="1"
              max="32"
              value={settings.concurrency ?? 5}
              onChange={(e) =>
                onUpdate({ concurrency: parseInt(e.target.value, 10) })
              }
              className="settings-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="timeout">超时时间 (--timeout，秒)</label>
            <input
              id="timeout"
              type="number"
              min="1"
              max="300"
              value={settings.timeout ?? 10}
              onChange={(e) =>
                onUpdate({ timeout: parseInt(e.target.value, 10) })
              }
              className="settings-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="segmentRetries">分片重试次数 (--segment-retries)</label>
            <input
              id="segmentRetries"
              type="number"
              min="0"
              max="20"
              value={settings.segmentRetries ?? 5}
              onChange={(e) =>
                onUpdate({ segmentRetries: parseInt(e.target.value, 10) })
              }
              className="settings-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="manifestRetries">Manifest重试次数 (--manifest-retries)</label>
            <input
              id="manifestRetries"
              type="number"
              min="0"
              max="20"
              value={settings.manifestRetries ?? 3}
              onChange={(e) =>
                onUpdate({ manifestRetries: parseInt(e.target.value, 10) })
              }
              className="settings-input"
            />
          </div>
        </div>

        <div className="settings-section">
          <h4 className="section-title">高级选项</h4>

          <div className="form-group">
            <label htmlFor="userAgent">User Agent</label>
            <input
              id="userAgent"
              type="text"
              placeholder="默认 UA"
              value={settings.userAgent ?? ""}
              onChange={(e) => onUpdate({ userAgent: e.target.value })}
              className="settings-input"
            />
            <span className="help-text">设置 HTTP 请求头中的 User-Agent</span>
          </div>

          <div className="checkbox-group">
            <input
              id="noMerge"
              type="checkbox"
              checked={settings.noMerge ?? false}
              onChange={(e) => onUpdate({ noMerge: e.target.checked })}
            />
            <label htmlFor="noMerge">不合并分片 (--no-merge)</label>
          </div>

          <div className="checkbox-group">
            <input
              id="inMemoryCache"
              type="checkbox"
              checked={settings.inMemoryCache ?? false}
              onChange={(e) => onUpdate({ inMemoryCache: e.target.checked })}
            />
            <label htmlFor="inMemoryCache">内存缓存 (--in-memory-cache)</label>
          </div>
        </div>
      </div>
    </div>
  )
}
