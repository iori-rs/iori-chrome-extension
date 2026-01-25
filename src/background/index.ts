import "./detector"
import "./messages"
import "./tabs"
import "./badge"

import { cleanStaleData } from "./storage"

// Clean up stale data when the extension starts or updates
chrome.runtime.onStartup.addListener(cleanStaleData)
chrome.runtime.onInstalled.addListener(cleanStaleData)

console.log("[Media Sniffer] Background service worker initialized")
