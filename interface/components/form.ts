/**
 * sxh 2023-11-10
 * 严格的类型定义有助于后期项目的维护，并能极大的提高代码可靠性
 * 表单类型定义
 */

/**
 * 通用column
 */
export interface CommonColumn {
  //绑定表单的属性
  prop: string
  //标签名称
  label?: string
  //允许定制样式
  style?: string
  //定义一个插槽名称，使用该名称作为插槽可自定义渲染该列内容
  slotName?: string
}

/**
 * 通用column
 */
export interface CommonFormColumn {
}

/**
 * 通用column
 */
export interface CommonTableColumn extends CommonColumn{
  //表格列是否可以编辑
  editable?: boolean
  editParam?: Function | Object
}


/**
 * 可编辑表格column
 */
export class EditableTableColumn implements CommonTableColumn {
  //绑定表单的属性
  readonly prop: string
  //想要让表格列可以编辑，此项必须设为true
  readonly editable = true
}
