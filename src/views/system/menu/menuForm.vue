<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll">
      <m-form
          ref="formRef"
          :colspan="24"
          :columns="columns"
          :model="formData"
          :handleType="props.handleType"
      />
    </el-scrollbar>
    <div class="m-footer">
      <el-button icon="close" @click="close()">取消</el-button>
      <el-button
          v-if="['add', 'edit'].includes(handleType)"
          v-auth="['add', 'edit']"
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
import { queryMenuList, postSaveMenu, getMenuById } from '@/api/system/menu'

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
  cache: true,
  enabled: true,
})

if (props.handleType !== 'add') {
  // 查询明细
  getMenuById(props.modelValue.id).then(res => {
    formData.value = res.data
  })
}
// 上级菜单下拉框数据
const parentMenuList = ref([])
queryMenuList({ isPage: false, param: { flag: 'selectParentMenu' } }).then(res => {
  let list = res.data.list.reverse()
  const menus = []
  let currentMenu
  while (list.length) {
    // 排列，符合的排到末尾等待取出
    const leftArr = []
    const rightArr = []
    list.forEach(a => {
      if (currentMenu) {
        if (a.parentId === currentMenu.id) rightArr.push(a)
        else leftArr.push(a)
      } else {
        if (a.parentId) leftArr.push(a)
        else rightArr.push(a)
      }
    })
    // 匹配数据第一个的标记当前子项最后一个
    if (rightArr.length) rightArr[0].isLastChid = true
    // 标记匹配项的层级
    rightArr.forEach(i => {
      i.level = currentMenu ? currentMenu.level + 1 : 0
    })
    list = [...leftArr, ...rightArr]
    // 取出最后一项
    currentMenu = list.pop()
    let prefix = ''
    if (currentMenu.level) {
      let level = currentMenu.level
      while (level--) prefix += '****'
      prefix += currentMenu.isLastChid ? '└ ' : '├ '
    }
    menus.push({
      platform: currentMenu.platform,
      value: currentMenu.id,
      label: prefix + currentMenu.title,
    })
  }
  parentMenuList.value = menus
})

// 表单字段根据表单数据变化，有所不同
const columns = ref([])
watchEffect(() => {
  columns.value = [
    {
      prop: 'platform',
      label: '平台',
      type: 'radio-group',
      itemList: platFormList,
      // 有上级菜单时，直接继承上级的平台值，不可手动更改
      disabled: !!formData.value.parentId,
      rules: { required: true, trigger: 'blur' },
    },
    {
      prop: 'parentId',
      label: '上级菜单',
      placeholder: '请选择上级菜单',
      type: 'select',
      filterable: true,
      itemList: parentMenuList.value,
      onChange (val) {
        formData.value.platform = parentMenuList.value.find(i => i.value === val)?.platform
      }
    },
    {
      prop: 'type',
      label: '菜单类型',
      type: 'radio-group',
      itemList: menuTypeList,
      rules: { required: true, trigger: 'blur' }
    },
    { prop: 'title', label: '菜单标题', rules: { required: true, trigger: 'blur' } },
    {
      prop: 'handleType',
      label: '处理类型',
      // 只有为菜单时才需要选择处理类型
      hidden: formData.value.type !== 'menu',
      type: 'radio-group',
      itemList: handleTypeList,
      onChange (val) {
        if (val === 'iframe') formData.value.component = '/src/views/iframe/index.vue'
      },
      comment: <span>点击菜单时的处理方式<br/> route：打开组件页面。<br/>iframe：内嵌一个外链地址的iframe。<br/>outer：直接打开跳转外链地址窗口。</span>
    },
    {
      prop: 'name',
      label: 'name',
      // 处理类型是外链，隐藏此项
      hidden: formData.value.handleType === 'outer',
      rules: { required: true, trigger: 'blur' },
      comment: '作为后端鉴权使用，建议使用实际意义的英文单词，web平台同时对应vue-router的name属性，鉴权时需要拼接上级name。'
    },
    {
      prop: 'path',
      label: '路由路径',
      // 菜单类型为按钮,或者处理类型是外链，隐藏此项
      hidden: ['btn'].includes(formData.value.type) || formData.value.handleType === 'outer',
      rules: { required: true, trigger: 'blur' },
      comment: <span>
      web平台对应vue-router的path, 实际访问的路由路径会在浏览器地址栏显示，系统会自动拼接父级路径变成一个完整路径，
        <span style="color: red;">所以不用手动拼接父路由路径。</span>
      </span>
    },
    {
      prop: 'component',
      label: '组件全路径',
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
      label: 'URL地址',
      hidden: !['iframe', 'outer'].includes(formData.value.handleType),
      rules: { required: true }
    },
    {
      prop: 'icon',
      label: '菜单图标',
      // 按钮不需要选择图标
      hidden: formData.value.type === 'btn',
      type: 'icon'
    },
    {
      prop: 'order',
      label: '排序号',
      // 按钮不需要排序号
      hidden: formData.value.type === 'btn',
      comment: '菜单的排列顺序，小号排在前，大号排在后。'
    },
    { prop: 'cache', label: '是否缓存', type: 'switch', comment: '开启后，切换菜单时，导航页签的页面内容将会缓存起来。' },
    { prop: 'enabled', label: '是否启用', type: 'switch' },
  ]
})

// 保存方法
function save () {
  formRef.value.validate().then(() => {
    postSaveMenu(formData.value, {
      loadingRef: saveLoading,
      showSuccessMsg: true,
      successMsg: '保存成功'
    }).then(() => close('refresh'))
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
