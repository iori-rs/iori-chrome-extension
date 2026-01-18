import { useCallback, useEffect, useState } from "react"
import type { MediaStream } from "../types"

export const useMediaStreams = () => {
  const [streams, setStreams] = useState<MediaStream[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTabId, setCurrentTabId] = useState<number | null>(null)

  const loadStreams = useCallback(async () => {
    setLoading(true)
    try {
      // Get current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

      if (!tab?.id) {
        setLoading(false)
        return
      }

      setCurrentTabId(tab.id)

      // Get stored streams for this tab
      const storageKey = `media_streams_${tab.id}`
      const result = await chrome.storage.local.get(storageKey)
      const tabStreams: MediaStream[] = result[storageKey] || []

      setStreams(tabStreams)
    } catch (error) {
      console.error("Error loading streams:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStreams()
  }, [loadStreams])

  return { streams, loading, currentTabId, reload: loadStreams }
}
