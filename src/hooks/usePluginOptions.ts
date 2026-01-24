import { useEffect, useState } from "react"
import type { PluginOption } from "../plugins/types"

export function usePluginOptions(
  pluginName: string | undefined,
  availableOptions: PluginOption[]
) {
  // Initialize with default values immediately
  const [options, setOptions] = useState<Record<string, string | boolean>>(
    () => {
      const defaults: Record<string, string | boolean> = {}
      availableOptions.forEach((opt) => {
        defaults[opt.key] = opt.defaultValue
      })
      return defaults
    }
  )

  useEffect(() => {
    if (!pluginName || availableOptions.length === 0) {
      return
    }

    const storageKey = `iori_plugin_options_${pluginName}`

    chrome.storage.local.get(storageKey, (result) => {
      const saved = result[storageKey]
      if (saved) {
        setOptions((prev) => ({
          ...prev,
          ...saved
        }))
      }
    })
  }, [pluginName])

  const updateOption = (key: string, value: string | boolean) => {
    setOptions((prev) => {
      const newOptions = { ...prev, [key]: value }

      if (pluginName) {
        const storageKey = `iori_plugin_options_${pluginName}`
        chrome.storage.local.set({ [storageKey]: newOptions })
      }

      return newOptions
    })
  }

  return {
    options,
    updateOption
  }
}
