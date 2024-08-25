import MarkdownIt from 'markdown-it'

/**
 * 支持Mermaid图表
 * 2024-7-14 sunxh
 */
export default function useMermaid(md: MarkdownIt) {
  const defaultRenderer = md.renderer.rules.fence
  md.renderer.rules.fence = (tokens, index, options, env, slf) => {
    const token = tokens[index]
    const language = token.info.trim()
    if (language === 'mermaid') {
      return `<VpMermaid id="mermaid-${index}" code="${encodeURIComponent(token.content)}"/>`
    }
    return defaultRenderer(tokens, index, options, env, slf)
  }
}
