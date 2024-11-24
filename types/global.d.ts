/**
 * GlobalComponents for Volar
 */
import type MExcelImport from '@/components/ExcelImport.vue'
import type MOperationButton from '@/components/table/OperationButton.vue'
import type MUpload from '@/components/form/Upload.vue'
import type MComment from '@/components/Comment.vue'
import type MIconSelect from '@/components/form/IconSelect.vue'
import type MIcon from '@/components/Icon.vue'
import type MSvgIcon from '@/components/SvgIcon.vue'
import type MSingleDatePicker from '@/components/form/SingleDatePicker.vue'
import type MForm from '@/components/form/index.vue'
import type MTable from '@/components/table/index.vue'
import type MTopFilter from '@/components/TopFilter.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    MForm: typeof MForm
    MTable: typeof MTable
    MSvgIcon: typeof MSvgIcon
    MTopFilter: typeof MTopFilter
    MSingleDatePicker: typeof MSingleDatePicker
    MIcon: typeof MIcon
    MIconSelect: typeof MIconSelect
    MComment: typeof MComment
    MUpload: typeof MUpload
    MOperationButton: typeof MOperationButton
    MExcelImport: typeof MExcelImport
  }
}
