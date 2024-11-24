import type MarkdownIt from 'markdown-it'

export default (md: MarkdownIt): void => {
  /**
   * To enable the plugin to be parsed in the demo description, the content is rendered as span instead of ElTag.
   */
  md.renderer.rules.tag = (tokens, idx) => {
    const token = tokens[idx]
    const value = token.content
    /**
     * Add styles for some special tags
     * vitepress/styles/content/tag-content.scss
     */
    const tagClass = ['danger', 'warning', 'success'].includes(token.meta)
      ? token.meta
      : ''
    return `<span class="vp-tag ${tagClass}">${value}</span>`
  }

  md.inline.ruler.before('emphasis', 'tag', (state, silent) => {
    const tagRegExp = /^\^\(([^)]*)\)([a-z]*)?/
    const str = state.src.slice(state.pos, state.posMax)

    if (!tagRegExp.test(str)) return false
    if (silent) return true

    const result = str.match(tagRegExp)

    if (!result) return false

    const token = state.push('tag', 'tag', 0)
    token.content = result[1].trim()
    token.meta = result[2]
    token.level = state.level
    state.pos += result[0].length

    return true
  })
}
