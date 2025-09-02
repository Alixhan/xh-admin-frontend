<template>
  <div style="position: relative; padding: 20px; background-color: var(--el-bg-color)">
    <el-switch v-model="formLoading" />
    <el-select v-model="handleType" placeholder="handleType" style="width: 100px">
      <el-option value="add">add</el-option>
      <el-option value="edit">edit</el-option>
      <el-option value="detail">detail</el-option>
    </el-select>
    <m-form
      ref="formRef"
      :colspan="12"
      :columns="columns"
      :model="formData"
      :handleType="handleType"
      :loading="formLoading"
    />
    <el-button type="primary" @click="submit">提交表单</el-button>
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref } from 'vue'
import type { CommonFormColumn } from '@i/components/form'

defineOptions({
  name: 'DemoForm'
})
const formRef = ref()
const handleType = ref('add')
const formLoading = ref(false)
const formData = reactive({})

// 表单列定义
const columns = ref<CommonFormColumn<any>[]>([
  { prop: 'input', label: 'input输入框' },
  {
    prop: 'select',
    label: 'select选择框',
    type: 'select',
    itemList: [
      { value: '1', label: '选我发大财' },
      { value: '2', label: '选我心想事成' },
      { value: '3', label: '选我身体健康' }
    ]
  },
  {
    prop: 'select',
    label: '定义valueKey和labelKey',
    type: 'select',
    comment: '可以传入valueKey指定数据对象的value属性，labelKey指定对象的label属性',
    valueKey: 'id',
    labelKey: 'name',
    itemList: [
      { id: '1', name: '选我发大财' },
      { id: '2', name: '选我心想事成' },
      { id: '3', name: '选我身体健康' }
    ]
  },
  {
    prop: 'autocomplete',
    label: '自动补全输入框',
    type: 'autocomplete',
    fetchSuggestions(queryString, callbback) {
      const res = [
        { value: 'vue', link: 'https://github.com/vuejs/vue' },
        { value: 'element', link: 'https://github.com/ElemeFE/element' },
        { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
        { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
        { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
        { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
        { value: 'babel', link: 'https://github.com/babel/babel' }
      ]
      callbback(res.filter((i) => i.value.indexOf(queryString) !== -1))
    },
    onSelect(item) {
      console.log(item)
    }
  },
  {
    prop: 'cascader',
    label: 'cascader级联选择框',
    type: 'cascader',
    options: [
      {
        value: 'guide',
        label: 'Guide',
        children: [
          {
            value: 'disciplines',
            label: 'Disciplines',
            children: [
              {
                value: 'consistency',
                label: 'Consistency'
              },
              {
                value: 'feedback',
                label: 'Feedback'
              },
              {
                value: 'efficiency',
                label: 'Efficiency'
              },
              {
                value: 'controllability',
                label: 'Controllability'
              }
            ]
          },
          {
            value: 'navigation',
            label: 'Navigation',
            children: [
              {
                value: 'side nav',
                label: 'Side Navigation'
              },
              {
                value: 'top nav',
                label: 'Top Navigation'
              }
            ]
          }
        ]
      },
      {
        value: 'component',
        label: 'Component',
        children: [
          {
            value: 'basic',
            label: 'Basic',
            children: [
              {
                value: 'layout',
                label: 'Layout'
              },
              {
                value: 'color',
                label: 'Color'
              },
              {
                value: 'typography',
                label: 'Typography'
              },
              {
                value: 'icon',
                label: 'Icon'
              },
              {
                value: 'button',
                label: 'Button'
              }
            ]
          },
          {
            value: 'form',
            label: 'Form',
            children: [
              {
                value: 'radio',
                label: 'Radio'
              },
              {
                value: 'checkbox',
                label: 'Checkbox'
              },
              {
                value: 'input',
                label: 'Input'
              },
              {
                value: 'input-number',
                label: 'InputNumber'
              },
              {
                value: 'select',
                label: 'Select'
              },
              {
                value: 'cascader',
                label: 'Cascader'
              },
              {
                value: 'switch',
                label: 'Switch'
              },
              {
                value: 'slider',
                label: 'Slider'
              },
              {
                value: 'time-picker',
                label: 'TimePicker'
              },
              {
                value: 'date-picker',
                label: 'DatePicker'
              },
              {
                value: 'datetime-picker',
                label: 'DateTimePicker'
              },
              {
                value: 'upload',
                label: 'Upload'
              },
              {
                value: 'rate',
                label: 'Rate'
              },
              {
                value: 'form',
                label: 'Form'
              }
            ]
          }
        ]
      },
      {
        value: 'resource',
        label: 'Resource',
        children: [
          {
            value: 'axure',
            label: 'Axure Components'
          },
          {
            value: 'sketch',
            label: 'Sketch Templates'
          },
          {
            value: 'docs',
            label: 'Design Documentation'
          }
        ]
      }
    ],
    props: {
      expandTrigger: 'hover'
    },
    onChange(val) {
      console.log(val)
    }
  },
  { prop: 'checkbox', label: 'checkbox', type: 'checkbox' },
  {
    prop: 'checkboxgroup',
    label: 'checkbox-group多选框组',
    type: 'checkbox-group',
    comment: '可以传入valueKey指定数据对象的value属性，labelKey指定对象的label属性',
    itemList: [
      { value: '1', label: '选我发大财' },
      { value: '2', label: '选我心想事成' },
      { value: '3', label: '选身体健康' }
    ]
  },
  {
    prop: 'colorpicker',
    label: 'color-picker颜色选择器',
    type: 'color-picker'
  },
  { prop: 'date', label: '日期选择', type: 'date' },
  {
    prop: 'datedaterange',
    prop2: 'datedaterange2',
    label: '日期段选择',
    type: 'daterange'
  },
  {
    prop: 'datedaterange',
    prop2: 'datedaterange2',
    label: '日期段独立选择',
    type: 'daterange',
    single: true,
    comment: '如果需要时间段起止独立选择，则可以设置single为true, 其他时间段选择使用一致，datetimerange, monthrange'
  },
  {
    prop: 'input-number',
    label: 'Input Number 数字输入框',
    type: 'input-number'
  },
  { prop: 'radio', label: 'radio', type: 'radio' },
  {
    prop: 'radiogroup',
    label: 'radio-group单选选框组',
    type: 'radio-group',
    comment: '可以传入valueKey指定数据对象的value属性，labelKey指定对象的label属性',
    itemList: [
      { value: '1', label: '选我发大财' },
      { value: '2', label: '选我心想事成' },
      { value: '3', label: '选身体健康' }
    ]
  },
  {
    prop: 'radiogroup',
    label: 'radio-group定制子选项的属性',
    type: 'radio-group',
    comment:
      '和select一样，可以传入valueKey指定数据对象的value属性，labelKey指定对象的label属性, 还可以设置itemParam的值定制option选项的属性， checkbox同理',
    valueKey: 'id',
    itemList: [
      { id: '1', label: '选我发大财' },
      { id: '2', label: '选我心想事成' },
      { id: '3', label: '选身体健康' }
    ],
    itemParam: {
      border: false
    }
  },
  { prop: 'rate', label: 'rate评分', type: 'rate' },
  { prop: 'slider', label: 'rate滑块', type: 'slider' },
  { prop: 'switch', label: 'switch开关', type: 'switch' },
  {
    prop: 'input2',
    label: '输入框验证',
    comment:
      '验证在兼容原element验证的基础上进行了增强,如：默认将label拼接至错误消息中，添加了一些常用的验证等， 具体可以查看/utils/validate.js',
    rules: [{ required: true, type: 'number' }]
  },
  {
    prop: 'file',
    label: '图片上传',
    type: 'upload-img',
    rules: [{ required: true, trigger: 'change' }],
    multiple: true,
    limit: 5
  },
  {
    prop: 'file2',
    label: '图片上传前裁剪',
    type: 'upload-img',
    limit: 5,
    comment: (
      <span>
        裁剪功能引用vue-cropper组件，更多裁剪属性定制参考官网文档，
        <a href="https://github.com/xyxiao001/vue-cropper#readme" target="_blank">
          https://github.com/xyxiao001/vue-cropper#readme
        </a>
      </span>
    ),
    cropper: {}
  },
  {
    prop: 'file4',
    label: '图片上传前裁剪固定裁剪框比例',
    type: 'upload-img',
    limit: 5,
    comment: (
      <span>
        裁剪功能引用vue-cropper组件，更多裁剪属性定制参考官网文档，
        <a href="https://github.com/xyxiao001/vue-cropper#readme" target="_blank">
          https://github.com/xyxiao001/vue-cropper#readme
        </a>
      </span>
    ),
    cropper: {
      // 固定比例
      fixed: true,
      // 固定比例
      fixedNumber: [1, 1]
    }
  },
  {
    prop: 'file3',
    label: '文件上传',
    type: 'upload-file',
    limit: 5
  },
  {
    prop: 'p11',
    label: 'ElTreeSelect 树形选择',
    type: 'tree-select',
    data: [
      {
        value: '1',
        label: 'Level one 1',
        children: [
          {
            value: '1-1',
            label: 'Level two 1-1',
            children: [
              {
                value: '1-1-1',
                label: 'Level three 1-1-1'
              }
            ]
          }
        ]
      },
      {
        value: '2',
        label: 'Level one 2',
        children: [
          {
            value: '2-1',
            label: 'Level two 2-1',
            children: [
              {
                value: '2-1-1',
                label: 'Level three 2-1-1'
              }
            ]
          },
          {
            value: '2-2',
            label: 'Level two 2-2',
            children: [
              {
                value: '2-2-1',
                label: 'Level three 2-2-1'
              }
            ]
          }
        ]
      },
      {
        value: '3',
        label: 'Level one 3',
        children: [
          {
            value: '3-1',
            label: 'Level two 3-1',
            children: [
              {
                value: '3-1-1',
                label: 'Level three 3-1-1'
              }
            ]
          },
          {
            value: '3-2',
            label: 'Level two 3-2',
            children: [
              {
                value: '3-2-1',
                label: 'Level three 3-2-1'
              }
            ]
          }
        ]
      }
    ]
  },
  { prop: 'p12', label: 'ElColorPickerPanel 颜色选择器面板', type: 'color-picker-panel' },
  { prop: 'p13', label: 'ElDatePickerPanel 日期选择器面板', type: 'date-picker-panel', $param: { type: 'month' } },
  { prop: 'p14', label: 'ElInputTag 标签输入框', type: 'input-tag' },
  {
    prop: 'p15',
    label: 'ElMention 提及',
    type: 'mention',
    options: [
      {
        label: 'Fuphoenixes',
        value: 'Fuphoenixes'
      },
      {
        label: 'kooriookami',
        value: 'kooriookami'
      },
      {
        label: 'Jeremy',
        value: 'Jeremy'
      },
      {
        label: 'btea',
        value: 'btea'
      }
    ]
  }
])

async function submit() {
  // 提交前会验证表单
  const data = await formRef.value.submit()
  console.info(data)
}
</script>
<style lang="scss" scoped></style>
