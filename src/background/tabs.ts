import { clearTabStreams } from "./storage"

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  clearTabStreams(tabId)
})

// Clean up when tab is refreshed/navigated
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId === 0) {
    console.log(
      "[Media Sniffer] Navigation detected, clearing streams for tab:",
      details.tabId
    )
    clearTabStreams(details.tabId)
  }
})
