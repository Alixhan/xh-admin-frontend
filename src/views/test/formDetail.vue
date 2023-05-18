<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll">
      <m-form
          ref="formRef"
          :colspan="24"
          :columns="columns"
          :model="formData"
          :handleType="props.handleType"
          v-model:loading="saveLoading"
      />
    </el-scrollbar>
    <div class="m-footer">
      <el-button icon="close" @click="close()">取消</el-button>
      <el-button
          icon="check"
          type="primary"
          :loading="saveLoading"
          @click="save">
        保存
      </el-button>
    </div>
  </div>
</template>
<script setup lang="jsx">
import { ref, watchEffect } from 'vue'
import { handleTypeList, menuTypeList, platFormList } from './constant'

const props = defineProps({
  handleType: {
    type: String,
    default: 'add'
  },
  modelValue: {}
})
const emit = defineEmits(['close'])

const formRef = ref()
const saveLoading = ref(false)
const formData = ref({
  file: [
    {
      name: 'food.jpeg',
      url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
    },
  ],
  cache: true,
  enabled: true,
})

// 表单字段根据表单数据变化，有所不同
const columns = ref([])
watchEffect(() => {
  columns.value = [
    {
      prop: 'file',
      label: '文件上传',
      type: 'uploadImg',
      rules: [{ required: true, trigger: 'change' }],
      multiple: true,
      limit: 5,
    },
    {
      prop: 'file2',
      label: '文件裁剪',
      type: 'uploadImg',
      rules: [{ required: true, trigger: 'change' }],
      limit: 5,
      cropper: {

      }
    },
    // {
    //   prop: 'platform',
    //   label: '平台',
    //   type: 'radio-group',
    //   itemList: platFormList,
    //   rules: { required: true, trigger: 'blur' },
    // },
    // {
    //   prop: 'parentId',
    //   label: '上级菜单',
    //   placeholder: '请选择上级菜单',
    //   type: 'select',
    //   filterable: true,
    //   itemList () {
    //     return new Promise((resolve) => {
    //       setTimeout(() => {
    //         resolve([
    //           { value: 1, label: '选项1' },
    //           { value: 2, label: '选项2' },
    //           { value: 3, label: '选项3' },
    //         ])
    //       }, 2000)
    //     })
    //   },
    //   onChange (val) {
    //     console.info(val)
    //   }
    // },
    // {
    //   prop: 'type',
    //   label: '菜单类型',
    //   type: 'radio-group',
    //   itemList: menuTypeList,
    //   rules: { required: true, trigger: 'blur' }
    // },
    // { prop: 'title', label: '菜单标题', rules: { required: true, trigger: 'blur' } },
    // {
    //   prop: 'handleType',
    //   label: '处理类型',
    //   type: 'radio-group',
    //   itemList: handleTypeList,
    //   onChange (val) {
    //     if (val === 'iframe') formData.value.component = '/src/views/iframe/index.vue'
    //   },
    //   comment: <span>点击菜单时的处理方式<br/> route：打开组件页面。<br/>iframe：内嵌一个外链地址的iframe。<br/>outer：直接打开跳转外链地址窗口。</span>
    // },
    // {
    //   prop: 'name',
    //   label: 'name',
    //   rules: { required: true, trigger: 'blur' },
    //   comment: '作为后端鉴权使用，建议使用实际意义的英文单词，web平台同时对应vue-router的name属性，鉴权时需要拼接上级name。'
    // },
    {
      prop: 'path',
      label: '路由路径',
      rules: { required: true, trigger: 'blur' },
      comment: <span>
      web平台对应vue-router的path, 实际访问的路由路径会在浏览器地址栏显示，系统会自动拼接父级路径变成一个完整路径，
        <span style="color: red;">所以不用手动拼接父路由路径。</span>
      </span>
    },
    // {
    //   prop: 'component',
    //   label: '组件全路径',
    //   comment: 'web平台对应vue-router的component路径，请填写组件的完整路径，例：/views/system/menu/index.vue',
    //   rules: { required: true, trigger: 'blur' }
    // },
    // // iframe和外链需要填写URL
    // {
    //   prop: 'outerUrl',
    //   label: 'URL地址',
    //   hidden: !['iframe', 'outer'].includes(formData.value.handleType),
    //   rules: { required: true }
    // },
    // {
    //   prop: 'icon',
    //   label: '菜单图标',
    //   type: 'icon'
    // },
    // {
    //   prop: 'order',
    //   label: '排序号',
    //   comment: '菜单的排列顺序，小号排在前，大号排在后。'
    // },
    // { prop: 'cache', label: '是否缓存', type: 'switch', comment: '开启后，切换菜单时，导航页签的页面内容将会缓存起来。' },
    // { prop: 'enabled', label: '是否启用', type: 'switch' },
  ]
})

function feff (a, b) {
  console.info('水电费水电费水电费', a, b)
}

// 保存方法
function save () {
  formRef.value.submit().then(res => {
    console.info(res)
  })
}

function close (type) {
  emit('close', type)
}
</script>
<style lang="scss" scoped>
.form-view {
  height: 100%;
  display: flex;
  flex-direction: column;

  .m-form-scroll {
    flex-grow: 1;
    padding-right: 10px;
    margin-right: -10px;
  }
}
</style>
