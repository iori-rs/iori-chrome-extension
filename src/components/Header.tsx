import { Radio } from "lucide-react"
import "./Header.css"

export function Header() {
  return (
    <header className="popup-header">
      <Radio className="header-icon" />
      <h2 className="header-title">流媒体嗅探器</h2>
    </header>
  )
}
