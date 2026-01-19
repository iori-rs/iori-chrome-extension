export const getFileExtension = (url: string): string => {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname.toLowerCase()
    if (pathname.endsWith(".m3u8")) return "HLS"
    if (pathname.endsWith(".mpd")) return "DASH"
    return "Unknown"
  } catch {
    return "Unknown"
  }
}
