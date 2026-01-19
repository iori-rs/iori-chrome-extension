import type { MsgGetCookie } from "~src/types"

/**
 * Fetches a cookie value by name from the browser's cookie store
 * @param cookieName - The name of the cookie to retrieve
 * @returns Promise resolving to the cookie value, or undefined if not found or on error
 */
export async function getCookie(
  cookieName: string
): Promise<string | undefined> {
  try {
    const cookieValue = await chrome.runtime.sendMessage<
      MsgGetCookie,
      string | undefined
    >({
      type: "GET_COOKIE",
      name: cookieName
    })

    return cookieValue
  } catch (e) {
    console.warn(`[Cookie Util] Failed to fetch cookie "${cookieName}"`, e)
    return undefined
  }
}
