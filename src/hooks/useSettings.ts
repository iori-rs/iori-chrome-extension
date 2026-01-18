import { useEffect, useState } from "react"

import type { UserSettings } from "../types"

const STORAGE_KEY = "iori_settings"

const DEFAULT_SETTINGS: UserSettings = {
  concurrency: 5 // default value
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      if (result[STORAGE_KEY]) {
        setSettings({ ...DEFAULT_SETTINGS, ...result[STORAGE_KEY] })
      }
      setLoading(false)
    })
  }, [])

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    chrome.storage.local.set({ [STORAGE_KEY]: updated })
  }

  return {
    settings,
    loading,
    updateSettings
  }
}
