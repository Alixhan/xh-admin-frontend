import type MarkdownIt from 'markdown-it'
import ApiTable from './api-table'
import DemoContainer from './demo-container'
import TableWrapper from './table-wrapper'
import tag from './tag'
import tooltip from './tooltip'
import MermaidExample from './mermaid'
// import ExternalLinkIcon from './external-link-icon'
import link from './link'

export default function install(md: MarkdownIt) {
  md.use(ApiTable)
  // md.use(ExternalLinkIcon)
  md.use(TableWrapper)
  md.use(tag)
  md.use(tooltip)
  md.use(DemoContainer)
  md.use(MermaidExample)
  md.use(link)
}
