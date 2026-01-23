import { NicoPlugin } from "./impl/nico"
import { OpenrecPlugin } from "./impl/openrec"
import { ShowroomPlugin } from "./impl/showroom"
import type { IoriPlugin } from "./types"

const plugins: IoriPlugin[] = [
  new OpenrecPlugin(),
  new NicoPlugin(),
  new ShowroomPlugin()
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
