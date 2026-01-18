import { Radio, Settings } from "lucide-react"
import { Button } from "@base-ui/react/button"
import "./style.css"

interface HeaderProps {
  onSettingsClick?: () => void
  showSettingsButton?: boolean
}

export function Header({
  onSettingsClick,
  showSettingsButton = true
}: HeaderProps) {
  return (
    <header className="popup-header">
      <div className="header-left">
        <Radio className="header-icon" />
        <h2 className="header-title">流媒体嗅探器</h2>
      </div>
      {showSettingsButton && (
        <Button onClick={onSettingsClick} className="settings-button">
          <Settings size={18} />
        </Button>
      )}
    </header>
  )
}
