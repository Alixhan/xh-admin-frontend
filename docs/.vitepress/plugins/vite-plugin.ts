import type {Plugin} from 'vitepress'
import {readFileSync} from 'node:fs'

/**
 * 因为 doc文档为 ssr环境，很多地方略有不同，此插件主要做差异化处理
 * 2024-7-14 sunxh
 */
export default function MyVitePlugin(): Plugin {
  return {
    name: 'my-vite-plugin',
    enforce: 'pre',
    transform(code: string, id: string) {
      // 替换一下system.ts代码逻辑
      if (id.endsWith('src/stores/system.ts')) {
        return readFileSync('docs/.vitepress/plugins/system.mts', 'utf8')
      }
      return code
    }
  }
}
