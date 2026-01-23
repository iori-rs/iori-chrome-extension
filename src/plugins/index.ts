import { NicoPlugin } from "./impl/nico"
import { NicoChannelPlugin } from "./impl/nicochannel"
import { OpenrecPlugin } from "./impl/openrec"
import { RadikoPlugin } from "./impl/radiko"
import { ShowroomPlugin } from "./impl/showroom"
import type { IoriPlugin } from "./types"

const plugins: IoriPlugin[] = [
  new OpenrecPlugin(),
  new NicoPlugin(),
  new NicoChannelPlugin(),
  new ShowroomPlugin(),
  new RadikoPlugin()
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
