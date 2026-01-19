import { NicoPlugin } from "./impl/nico"
import { OpenrecPlugin } from "./impl/openrec"
import type { IoriPlugin } from "./types"

const plugins: IoriPlugin[] = [
  new OpenrecPlugin(),
  new NicoPlugin()
  // Add more plugins here
]

/**
 * Get the first matching plugin for the given URL
 */
export function getPlugin(pageUrl: string): IoriPlugin | undefined {
  return plugins.find((p) => p.match(pageUrl))
}

/**
 * Get all registered plugins
 */
export function getPlugins(): IoriPlugin[] {
  return plugins
}
