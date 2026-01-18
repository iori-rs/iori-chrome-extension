import { ActionPanel } from "./components/ActionPanel"
import { EmptyState } from "./components/EmptyState"
import { Header } from "./components/Header"
import { StreamList } from "./components/StreamList"
import { useMediaStreams } from "./hooks/useMediaStreams"
import "./popup.css"

function IndexPopup() {
  const { streams, loading, reload } = useMediaStreams()

  return (
    <div className="popup-container">
      <Header />

      {loading ? (
        <div className="loading-container">
          <div className="loader" />
          <span>正在扫描流媒体资源...</span>
        </div>
      ) : streams.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ActionPanel count={streams.length} onRefresh={reload} />
          <StreamList streams={streams} />
        </>
      )}
    </div>
  )
}

export default IndexPopup

