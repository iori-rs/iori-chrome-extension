# Iori Chrome Extension - AI Agent Instructions

## Project Overview
This is a Chrome Extension built with **Plasmo**, React, and TypeScript. It detects and captures media streams (HLS/m3u8 and DASH/mpd) from web pages. The primary goal is to sniff these media resources and generate download commands for the CLI tool **shiori**.

### Key Architecture
- **Framework**: Plasmo (Manifest V3)
- **UI**: React 18 with Standard CSS (no Tailwind)
- **Icons**: `lucide-react`
- **State**: React state for UI, `chrome.storage.local` for cross-context data persistence.

## Architecture & Data Flow

### 1. Media Detection Strategy
The extension uses a dual-strategy approach to detect media:

*   **HLS (.m3u8)**: **Main World Injection**
    *   **File**: `src/contents/interceptor.ts` (`world: "MAIN"`)
    *   **Mechanism**: Monkey-patches `window.fetch` and `XMLHttpRequest` to inspect response bodies for `#EXT-X-STREAM-INF` tags.
    *   **Communication**: Sends found URLs via `window.postMessage` to the Isolated World.

*   **DASH (.mpd) / Fallback**: **URL Analysis**
    *   **File**: `src/background.ts`
    *   **Mechanism**: Checks URLs for `.mpd` extensions (and potentially other patterns).

### 2. Event Relay System
Because Main World scripts cannot access `chrome.runtime` APIs directly, a relay pattern is used:
1.  `src/contents/interceptor.ts` (Main World) -> `window.postMessage`
2.  `src/content.ts` (Isolated World) -> Listens for `window` messages -> `chrome.runtime.sendMessage`
3.  `src/background.ts` (Service Worker) -> Listen for runtime messages -> Saves to `chrome.storage.local`.

### 3. Data Storage
*   **Key Schema**: `media_streams_${tabId}`
*   **Data Type**: `MediaStream[]` (Array of objects with `url` and `timestamp`).
*   **Cleanup**: Storage should be cleared when tabs are closed or updated (managed in background).

## Project Structure
*   `src/background.ts`: Service worker. Handles storage logic and fallback URL sniffing.
*   `src/popup.tsx`: Main extension UI. Reads `chrome.storage` changes to update the list in real-time.
*   `src/contents/interceptor.ts`: **Main World** script. Heavily relies on browser native globals (`window`, `fetch`).
*   `src/content.ts`: **Isolated World** relay script.
*   `src/components/`: Reusable React components.
*   `src/hooks/useMediaStreams.ts`: Custom hook handling storage subscriptions.

## Development Workflows
*   **Dev Server**: `pnpm dev` - Starts the Plasmo dev server with hot reload.
*   **Build**: `pnpm build` - Generates production assets in `build/`.
*   **Package**: `pnpm package` - Zips for store submission.

## Coding Conventions
*   **Plasmo Config**: Content script configuration is exported as `export const config: PlasmoCSConfig = { ... }`.
*   **Messaging**: Use typed messages where possible (e.g., `{ type: "IORI_HLS_FOUND", url: string }`).
*   **Styling**: Use standard CSS modules or plain CSS files imported directly. Avoid inline styles for complex components.
*   **Async/Await**: Prefer async/await over promises for readability.

## Common Tasks
*   **Adding a new detector**:
    *   If it requires body inspection: Add logic to `src/contents/interceptor.ts`.
    *   If it requires URL inspection only: Add logic to `src/background.ts`.
*   **Updating UI**: Modify `src/popup.tsx` and usually `src/components/StreamList`.
