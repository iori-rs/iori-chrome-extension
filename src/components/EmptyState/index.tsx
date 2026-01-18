import { VideoOff } from "lucide-react"
import "./style.css"

export function EmptyState() {
  return (
    <div className="empty-state">
      <VideoOff className="empty-icon" size={48} />
      <p className="empty-text">当前页面未检测到流媒体资源</p>
      <p className="empty-hint">
        支持的格式: HLS (.m3u8) 和 MPEG-DASH (.mpd)
      </p>
    </div>
  )
}
