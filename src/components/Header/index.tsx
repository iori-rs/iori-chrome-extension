import { Button } from "@base-ui/react/button"
import { Settings } from "lucide-react"

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
        <h2 className="header-title">IORI</h2>
      </div>
      {showSettingsButton && (
        <Button onClick={onSettingsClick} className="settings-button">
          <Settings size={18} />
        </Button>
      )}
    </header>
  )
}
