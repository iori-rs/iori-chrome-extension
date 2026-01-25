import { useState } from "react"

import { ActionPanel } from "./components/ActionPanel"
import { EmptyState } from "./components/EmptyState"
import { Header } from "./components/Header"
import { SettingsPanel } from "./components/SettingsPanel"
import { StreamList } from "./components/StreamList"
import { useMediaStreams } from "./hooks/useMediaStreams"
import { useSettings } from "./hooks/useSettings"

import "./popup.css"

function IndexPopup() {
  const { streams, loading: streamsLoading, clear, currentTabUrl } = useMediaStreams()
  const { settings, loading: settingsLoading, updateSettings } = useSettings()
  const sortedStreams = (settings.streamSortOrder ?? "desc") === "desc" ? [...streams].reverse() : streams
  const [view, setView] = useState<"list" | "settings">("list")

  if (settingsLoading) {
    return null // or a global loading state
  }

  if (view === "settings") {
    return (
      <div className="popup-container">
        <SettingsPanel
          settings={settings}
          onUpdate={updateSettings}
          onBack={() => setView("list")}
        />
      </div>
    )
  }

  return (
    <div className="popup-container">
      <Header onSettingsClick={() => setView("settings")} />

      {streamsLoading ? (
        <div className="loading-container">
          <div className="loader" />
          <span>正在等待流媒体资源...</span>
        </div>
      ) : streams.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ActionPanel count={streams.length} onClear={clear} />
          <StreamList streams={sortedStreams} settings={settings} pageUrl={currentTabUrl} />
        </>
      )}
    </div>
  )
}

export default IndexPopup
