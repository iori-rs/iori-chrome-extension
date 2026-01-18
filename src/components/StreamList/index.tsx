import { StreamCard } from "../StreamCard"
import type { MediaStream, UserSettings } from "../../types"
import "./style.css"

interface StreamListProps {
  streams: MediaStream[]
  settings: UserSettings
}

export function StreamList({ streams, settings }: StreamListProps) {
  return (
    <div className="streams-list">
      {streams.map((stream, index) => (
        <StreamCard
          key={`${stream.url}-${index}`}
          stream={stream}
          settings={settings}
        />
      ))}
    </div>
  )
}
