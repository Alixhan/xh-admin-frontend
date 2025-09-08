import type MarkdownIt from 'markdown-it'

/**
 * 统一维护好外部的引用链接
 */
const links = {
  star: 'https://gitee.com/sun-xiaohan/xh-admin-frontend',
  vueuse: 'https://vueuse.org/',
  nvm: 'https://github.com/nvm-sh/nvm',
  'Element-plus': 'https://element-plus.org/',
  axios: 'https://github.com/axios/axios',
  'countup.js': 'https://github.com/inorganik/countUp.js',
  dayjs: 'https://day.js.org/',
  ECharts: 'https://echarts.apache.org/zh/index.html',
  Vue3: 'https://cn.vuejs.org/',
  exceljs: 'https://github.com/exceljs/exceljs',
  'file-saver': 'https://github.com/eligrey/FileSaver.js',
  filesize: 'https://github.com/avoidwork/filesize.js',
  lodash: 'https://lodash.com/',
  nprogress: 'http://github.com/rstacruz/nprogress',
  pinia: 'https://pinia.vuejs.org/zh/',
  'vue-cropper': 'https://github.com/xyxiao001/vue-cropper',
  'vue-i18n': 'https://vue-i18n.intlify.dev/',
  'vue-router': 'https://router.vuejs.org/',
  SortableJS: 'https://github.com/SortableJS/Sortable',
  autoprefixer: 'https://github.com/postcss/autoprefixer',
  vite: 'https://cn.vitejs.dev/',
  eslint: 'https://eslint.org/',
  sass: 'https://github.com/sass/dart-sass',
  typescript: 'https://www.typescriptlang.org/',
  vitepress: 'https://vitepress.dev/zh/',
  Spring: 'https://spring.io/',
  'Spring Cloud Alibaba': 'https://spring.io/projects/spring-cloud-alibaba',
  MinIo: 'https://min.io/',
  'Sa-Token': 'https://sa-token.cc',
  'SpringBoot': 'https://spring.io/projects/spring-boot/',
  swagger: 'https://swagger.io/',
  'SpringDoc': 'https://swagger.io/',
  'xxl-job': 'https://www.xuxueli.com/xxl-job',
  fastjson2: 'https://github.com/alibaba/fastjson2',
  ip2region: 'https://github.com/lionsoul2014/ip2region',
  javacv: 'https://github.com/bytedeco/javacv',
  hutool: 'https://github.com/dromara/hutool',
  mysql: 'https://www.mysql.com/',
  Redis: 'https://redis.io/',
  Jenkins: 'https://www.jenkins.io/zh/',
  Gitee: 'https://gitee.com/',
  Git: 'https://git-scm.com/',
  Maven: 'https://maven.apache.org',
  Nginx: 'https://nginx.org/en',
  Docker: 'https://www.docker.com/',
  Nacos: 'https://nacos.io/',
  // 内部链接
  'Upload 上传': '/document/frontend/components/upload',
  'Icon 图标': '/document/frontend/components/icon',
  'SingleDatePicker 日期范围': '/document/frontend/components/single-date-picker',
  'Form 表单': '/document/frontend/components/form',
  'Table 表格': '/document/frontend/components/table',
  'ExcelImport 导入': '/document/frontend/components/excel-import',
  CommonFormColumn: '/document/frontend/components/form#commonformcolumn-表单项',
  'Validate 数据验证': '/document/frontend/utils/validate',
  'Dict 获取数据字典详情': '/document/frontend/utils/dict',
  'EChart 图表': '/document/frontend/utils/echarts',
  'Request 请求': '/document/frontend/utils/request',
  文件请求链接: '/document/frontend/utils/file-url',
  'ContextMenu 上下文菜单': '/document/frontend/utils/context-menu',
  'Swagger 文档': '/document/backend/swagger',
  'BaseJdbcDao': '/document/backend/persistence#basejdbcdao',
  '操作数据库': '/document/backend/persistence',
}

export default (md: MarkdownIt): void => {
  md.renderer.rules.link = (tokens, idx) => {
    const token = tokens[idx]
    const url = links[token.content]

    if (url) {
      const target = url.startsWith('http') ? 'target="_blank"' : ''
      return `<a href="${url + token.meta[1]}" ${target} rel="noreferrer">${token.content}</a>${token.meta[0] ? `<code>${url}</code>` : ''}`
    }
    return token.content
  }

  md.inline.ruler.before('emphasis', 'link', (state, silent) => {
    const regExp = /^\^link\(([^)]*)\)(s?)(#[a-zA-Z0-9\-\u4e00-\u9fff]+)?/
    const str = state.src.slice(state.pos, state.posMax)

    if (!regExp.test(str)) return false
    if (silent) return true
    const result = str.match(regExp)
    if (!result) return false

    const token = state.push('link', 'link', 0)
    token.content = result[1]
    token.meta = [result[2] === 's', result[3] || '']
    token.level = state.level
    state.pos += result[0].length

    return true
  })
}
