import { StreamCard } from "../StreamCard"
import type { MediaStream } from "../../types"
import "./style.css"

interface StreamListProps {
  streams: MediaStream[]
}

export function StreamList({ streams }: StreamListProps) {
  return (
    <div className="streams-list">
      {streams.map((stream, index) => (
        <StreamCard key={`${stream.url}-${index}`} stream={stream} />
      ))}
    </div>
  )
}
