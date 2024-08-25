import MForm from './form/index.vue'
import MTable from './table/index.vue'
import MSvgIcon from './SvgIcon.vue'
import MIcon from './Icon.vue'
import MIconSelect from './form/IconSelect.vue'
import MTopFilter from './TopFilter.vue'
import MSingleDatePicker from './form/SingleDatePicker.vue'
import MComment from './Comment.vue'
import MUpload from './form/Upload.vue'
import MOperationButton from './table/OperationButton.vue'
import MExcelImport from './ExcelImport.vue'
import type { App } from 'vue'
import ShowContextMenu from '@/utils/context-menu'

export default function (app: App<Element>) {
  app.component('MForm', MForm)
  app.component('MTable', MTable)
  app.component('MSvgIcon', MSvgIcon)
  app.component('MTopFilter', MTopFilter)
  app.component('MSingleDatePicker', MSingleDatePicker)
  app.component('MIcon', MIcon)
  app.component('MIconSelect', MIconSelect)
  app.component('MComment', MComment)
  app.component('MUpload', MUpload)
  app.component('MOperationButton', MOperationButton)
  app.component('MExcelImport', MExcelImport)

  ShowContextMenu.install(app)
}
