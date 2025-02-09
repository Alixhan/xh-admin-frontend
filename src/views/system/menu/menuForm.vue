<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll">
      <m-form
        ref="formRef"
        :colspan="24"
        :columns="columns"
        :model="formData"
        :handleType="handleType"
        :loading="formLoading"
      />
    </el-scrollbar>
    <div class="m-footer">
      <el-button icon="close" @click="close()">{{ $t('common.cancel') }}</el-button>
      <el-button
        v-if="['add', 'edit'].includes(handleType)"
        v-auth="['system:menu:add', 'system:menu:edit']"
        icon="check"
        type="primary"
        :loading="saveLoading"
        @click="save"
      >
        {{ $t('common.save') }}
      </el-button>
    </div>
  </div>
</template>
<script setup lang="jsx">
import { ref, toRef, watchEffect } from 'vue'
import { generateTreeMenu, handleTypeList, menuTypeList, platFormList } from './constant'
import { getMenuById, postSaveMenu, queryMenuList } from '@/api/system/menu'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  handleType: {
    type: String,
    default: 'add'
  },
  modelValue: {}
})
const emit = defineEmits(['close'])

const formRef = ref()
const formLoading = ref(false)
const saveLoading = ref(false)
const formData = ref({
  handleType: '',
  type: '',
  cache: true,
  enabled: true
})

const handleType = ref(toRef(props, 'handleType').value)

init()

// 上级菜单下拉框数据
const parentMenuList = ref([])
// 上级菜单树形数据
const parentMenuListTree = ref([])

async function init() {
  formLoading.value = true
  await Promise.all([initFormData(), initParentMenuData()])
  formLoading.value = false
}

async function initFormData() {
  if (handleType.value !== 'add') {
    // 查询明细
    return getMenuById(props.modelValue.id).then((res) => {
      formData.value = res.data
      if (handleType.value === 'copy') {
        handleType.value = 'add'
        formData.value.id = ''
      }
    })
  }
  return Promise.resolve()
}

//初始化上级菜单数据
async function initParentMenuData() {
  return queryMenuList({
    isPage: false,
    param: { flag: 'selectParentMenu' }
  }).then((res) => {
    parentMenuList.value = res.data.list
    parentMenuListTree.value = generateTreeMenu(res.data.list)
  })
}

// 表单字段根据表单数据变化，有所不同
const columns = ref([])
watchEffect(() => {
  columns.value = [
    {
      prop: 'platform',
      label: t('system.menu.platform'),
      type: 'radio-group',
      itemList: platFormList,
      // 有上级菜单时，直接继承上级的平台值，不可手动更改
      disabled: !!formData.value.parentId,
      rules: { required: true, trigger: 'blur' }
    },
    {
      prop: 'parentId',
      label: t('system.menu.parent'),
      placeholder: t('system.menu.parentPlaceholder'),
      type: 'cascader',
      options: parentMenuListTree.value,
      props: {
        checkStrictly: true
      },
      onChange(val) {
        const parent = val && parentMenuList.value.find((i) => i.id === val[val.length - 1])
        formData.value.platform = parent?.platform
        formData.value.parentId = parent?.id
      }
    },
    {
      prop: 'type',
      label: t('system.menu.type'),
      type: 'radio-group',
      itemList: menuTypeList,
      rules: { required: true, trigger: 'blur' }
    },
    {
      prop: 'title',
      label: t('system.menu.title'),
      rules: { required: true, trigger: 'blur' }
    },
    {
      prop: 'handleType',
      label: t('system.menu.handleType'),
      // 只有为菜单时才需要选择处理类型
      hidden: formData.value.type !== 'menu',
      type: 'radio-group',
      itemList: handleTypeList,
      onChange(val) {
        if (val === 'iframe') formData.value.component = '/src/views/iframe/index.vue'
      },
      comment: (
        <span>
          点击菜单时的处理方式
          <br /> route：打开组件页面。
          <br />
          iframe：内嵌一个外链地址的iframe。
          <br />
          outer：直接打开跳转外链地址窗口。
        </span>
      )
    },
    {
      prop: 'name',
      label: 'Name',
      // 处理类型是外链，隐藏此项
      hidden: formData.value.handleType === 'outer',
      rules: { required: true, trigger: 'blur' },
      comment: '作为后端鉴权使用，建议使用实际意义的英文单词，web平台同时对应vue-router的name属性，应保证name唯一。'
    },
    {
      prop: 'path',
      label: t('system.menu.path'),
      // 菜单类型为按钮,或者处理类型是外链，隐藏此项
      hidden: ['btn'].includes(formData.value.type) || formData.value.handleType === 'outer',
      rules: { required: true, trigger: 'blur' },
      comment: (
        <span>
          web平台对应vue-router的path, 实际访问的路由路径会在浏览器地址栏显示，系统会自动拼接父级路径变成一个完整路径，
          <span style="color: red;">所以不用手动拼接父路由路径。</span>
        </span>
      )
    },
    {
      prop: 'component',
      label: t('system.menu.component'),
      // 处理类型为iframe时，默认指定固定的组件地址，无需手动填写
      disabled: formData.value.handleType === 'iframe',
      // 菜单类型为目录或按钮,或者处理类型是外链，隐藏此项
      hidden: ['dir', 'btn'].includes(formData.value.type) || formData.value.handleType === 'outer',
      comment: 'web平台对应vue-router的component路径，请填写组件的完整路径，例：/views/system/menu/index.vue',
      rules: { required: true, trigger: 'blur' }
    },
    // iframe和外链需要填写URL
    {
      prop: 'outerUrl',
      label: t('system.menu.outerUrl'),
      hidden: !['iframe', 'outer'].includes(formData.value.handleType),
      rules: { required: true }
    },
    {
      prop: 'icon',
      label: t('system.menu.icon'),
      // 按钮不需要选择图标
      hidden: formData.value.type === 'btn',
      type: 'icon-select'
    },
    {
      prop: 'order',
      label: t('common.order'),
      // 按钮不需要排序号
      hidden: formData.value.type === 'btn',
      comment: t('system.menu.orderComment')
    },
    {
      prop: 'cache',
      label: t('common.cache'),
      type: 'switch',
      // 按钮不需要排序号
      hidden: ['dir', 'btn'].includes(formData.value.type),
      comment: '开启后，切换菜单时，导航页签的页面内容将会缓存起来。'
    },
    { prop: 'enabled', label: t('common.isEnabled'), type: 'switch' }
  ]
})

// 保存方法
function save() {
  formRef.value.validate().then(() => {
    postSaveMenu(formData.value, {
      loadingRef: saveLoading,
      showSuccessMsg: true,
      successMsg: t('common.saveSuccess')
    }).then(() => close('refresh'))
  })
}

function close(type) {
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
