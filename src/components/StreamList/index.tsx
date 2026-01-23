import { StreamCard } from "../StreamCard"
import type { MediaStream, UserSettings } from "../../types"
import "./style.css"

interface StreamListProps {
  streams: MediaStream[]
  settings: UserSettings
  pageUrl: string
}

export function StreamList({ streams, settings, pageUrl }: StreamListProps) {
  return (
    <div className="streams-list">
      {streams.map((stream, index) => (
        <StreamCard
          key={`${stream.url}-${index}`}
          stream={stream}
          settings={settings}
          pageUrl={pageUrl}
          defaultExpanded={index === 0}
        />
      ))}
    </div>
  )
}
