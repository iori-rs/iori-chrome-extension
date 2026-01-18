import { Button } from "@base-ui/react/button"
import { RotateCw } from "lucide-react"
import "./style.css"

interface ActionPanelProps {
  count: number
  onRefresh: () => void
}

export function ActionPanel({ count, onRefresh }: ActionPanelProps) {
  return (
    <div className="action-panel">
      <span className="count-text">已捕获 {count} 个流媒体资源</span>
      <Button onClick={onRefresh} className="refresh-button">
        <RotateCw size={14} className="refresh-icon" />
        刷新
      </Button>
    </div>
  )
}
