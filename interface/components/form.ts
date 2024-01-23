/**
 * sxh 2023-11-10
 * 严格的类型定义有助于后期项目的维护，并能极大的提高代码可靠性
 * 表单类型定义
 */
import type {ValidRule} from '@i/utils/validate'
import type {CommonColumnType, SlotsObj} from '@i/components/index'
import type {FormProps} from 'element-plus'
import type {PropType} from 'vue'
import {formEmits, formProps} from 'element-plus'

/**
 * 表单列类型
 */
export declare type FormColumnType = CommonColumnType | 'separator'

/**
 * 表单类型
 */
export declare type FormType = 'add' | 'edit' | 'detail' | any

/**
 * 通用表单column
 */
export interface CommonFormColumn<T extends object> extends Partial<Omit<FormProps, 'rules'>> {
    //标题名称
    label?: string
    //表单类型
    type?: string
    //隐藏此列
    hidden?: boolean
    //绑定表单的属性
    prop?: string;
    // 当前节点数据校验规则
    rules?: ValidRule<T, keyof T> | ValidRule<T, keyof T>[];
    //疑问备注框
    comment?: any
    //显示必填星号
    required?: boolean
    //表单项插槽
    slots?: SlotsObj
    //允许用户按照自己的slotName插槽定制
    slotName?: string
    placeholder?: string
    startPlaceholder?: string
    endPlaceholder?: string
    [prop: string]: any
}


/**
 * 表单列类型
 */
export interface UploadFormColumn<T extends object> extends CommonFormColumn<T> {
    type: 'upload-file' | 'upload';
    //上传文件的限制数量
    limit?: number;
}

export const mFormProps = {
    ...formProps,
    // 表单处理类型
    handleType: {
        type: String as PropType<FormHandleType>,
        default: 'add'
    },
    // 跨列数，对应el-col
    colspan: {
        type: Number
    },
    // 表单对象
    model: {
        type: Object,
        required: true
    },
    // 表单列定义
    columns: {
        type: Array as PropType<CommonFormColumn<any>[]>,
        required: true
    },
    labelWidth: {
        type: String
    },
    scrollToError: {
        default: true
    },
    scrollIntoViewOptions: {
        default: {behavior: 'smooth', block: 'center', inline: 'center'}
    },
    //加载状态，为true时展示骨架屏
    loading: {
        type: Boolean
    },
}

export const mFormEmits = {
    ...formEmits
}
