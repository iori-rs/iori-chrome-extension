import { useEffect, useState } from "react"
import { Button } from "@base-ui/react/button"
import "./popup.css"

interface MediaStream {
  url: string
  timestamp: number
}

function IndexPopup() {
  const [streams, setStreams] = useState<MediaStream[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTabId, setCurrentTabId] = useState<number | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  useEffect(() => {
    loadStreams()
  }, [])

  const loadStreams = async () => {
    try {
      // Get current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      
      if (!tab.id) {
        setLoading(false)
        return
      }

      setCurrentTabId(tab.id)
      
      // Get stored streams for this tab
      const storageKey = `media_streams_${tab.id}`
      const result = await chrome.storage.local.get(storageKey)
      const tabStreams: MediaStream[] = result[storageKey] || []
      
      setStreams(tabStreams)
      setLoading(false)
    } catch (error) {
      console.error("Error loading streams:", error)
      setLoading(false)
    }
  }

  const copyToClipboard = async (url: string, index: number) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedIndex(index)
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedIndex(null)
      }, 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const getFileExtension = (url: string): string => {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname.toLowerCase()
      if (pathname.endsWith(".m3u8")) return "HLS"
      if (pathname.endsWith(".mpd")) return "DASH"
      return "Unknown"
    } catch {
      return "Unknown"
    }
  }

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  return (
    <div className="popup-container">
      <h2 className="popup-title">流媒体嗅探器</h2>

      {loading ? (
        <div className="loading-container">加载中...</div>
      ) : streams.length === 0 ? (
        <div className="empty-state">
          <p>当前页面未检测到流媒体资源</p>
          <p className="empty-state-hint">
            支持的格式: HLS (.m3u8) 和 MPEG-DASH (.mpd)
          </p>
        </div>
      ) : (
        <div>
          <div className="header-bar">
            <span>已捕获 {streams.length} 个流媒体资源</span>
            <Button onClick={loadStreams} className="refresh-button">
              刷新
            </Button>
          </div>

          <div className="streams-list">
            {streams.map((stream, index) => (
              <div key={index} className="stream-card">
                <div className="stream-header">
                  <span
                    className={`badge badge-${getFileExtension(stream.url).toLowerCase()}`}>
                    {getFileExtension(stream.url)}
                  </span>
                  <span className="stream-timestamp">
                    {formatTimestamp(stream.timestamp)}
                  </span>
                </div>

                <div className="stream-url">{stream.url}</div>

                <Button
                  onClick={() => copyToClipboard(stream.url, index)}
                  className={`copy-button ${copiedIndex === index ? "copied" : ""}`}>
                  {copiedIndex === index ? "✓ 已复制" : "复制链接"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default IndexPopup

