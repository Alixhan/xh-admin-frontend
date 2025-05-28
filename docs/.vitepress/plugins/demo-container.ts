import MdContainer from 'markdown-it-container'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { join } from 'node:path'

/**
 * markdown demo container
 * 2024/6/29 sxh
 */
export default function demoContainer(md) {
  md.use(MdContainer, 'demo', {
    validate(params) {
      return params.trim().match(/^demo\s*(.*)$/)
    },
    render(tokens: any[], idx: number) {
      if (tokens[idx].nesting === 1) {
        const sourceFileToken = tokens[idx + 2]
        const sourceFile = sourceFileToken.children?.[0].content ?? ''
        if (sourceFileToken.type === 'inline') {
          const fileDetail = getFileDetail(sourceFile)
          if (fileDetail) {
            const highlightCode = md.render('```' + fileDetail.suffix + '\n' + fileDetail.code + '\n```')
            return `<VpDemo path="${fileDetail.url}"><template #raw>${highlightCode}</template>`
          }
        }
      } else {
        return '</VpDemo>'
      }
    }
  })
}

function getFileDetail(url: string) {
  let dir = ''
  let fileName = url
  // 移除尾部的文件名和分隔符
  const lastIndex = url.lastIndexOf('/')
  if (lastIndex !== -1) {
    dir = '/' + url.slice(0, lastIndex)
    fileName = url.slice(lastIndex + 1)
  }
  const dirPath = fileURLToPath(new URL(`../../document/frontend/demo${dir}`, import.meta.url))
  const filesAndDirectories = readdirSync(dirPath)
  for (const str of filesAndDirectories) {
    const fullPath = join(dirPath, str)
    const stats = statSync(fullPath)
    if (stats.isFile()) {
      const [file, suffix] = str.split('.')
      if (file === fileName) {
        return {
          fileName,
          suffix,
          fullPath,
          url: url + '.' + suffix,
          code: readFileSync(fullPath, 'utf-8')
        }
      }
    }
  }
  throw new Error(`Incorrect source file: ${dirPath}\\${fileName}`)
}
