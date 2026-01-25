import { Button } from "@base-ui/react/button"
import { Trash2 } from "lucide-react"
import "./style.css"

interface ActionPanelProps {
  count: number
  onClear: () => void
}

export function ActionPanel({ count, onClear }: ActionPanelProps) {
  return (
    <div className="action-panel">
      <span className="count-text">已捕获 {count} 个流媒体资源</span>
      <Button onClick={onClear} className="clear-button">
        <Trash2 size={14} className="clear-icon" />
        清空
      </Button>
    </div>
  )
}
