import { useCallback, useEffect, useState } from "react"

import type { MediaStream } from "../types"

export const useMediaStreams = () => {
  const [streams, setStreams] = useState<MediaStream[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTabId, setCurrentTabId] = useState<number | null>(null)
  const [currentTabUrl, setCurrentTabUrl] = useState<string>("")

  const reversedStreams = [...streams].reverse()

  const loadStreams = useCallback(async () => {
    setLoading(true)
    try {
      // Get current active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })

      if (!tab?.id) {
        setLoading(false)
        return
      }

      setCurrentTabId(tab.id)
      setCurrentTabUrl(tab.url || "")

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

  // Listen for storage changes to auto-update the list
  useEffect(() => {
    if (!currentTabId) return

    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === "local") {
        const storageKey = `media_streams_${currentTabId}`
        if (changes[storageKey]) {
          const newStreams = changes[storageKey].newValue || []
          setStreams(newStreams)
        }
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange)

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [currentTabId])

  const clear = useCallback(async () => {
    if (!currentTabId) return
    const storageKey = `media_streams_${currentTabId}`
    await chrome.storage.local.remove(storageKey)
    setStreams([])
  }, [currentTabId])

  return {
    streams: reversedStreams,
    loading,
    currentTabId,
    currentTabUrl,
    reload: loadStreams,
    clear
  }
}
