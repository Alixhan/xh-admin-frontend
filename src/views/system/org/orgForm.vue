<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll">
      <m-form ref="formRef" :colspan="24" :columns="columns" :model="formData" :handleType="handleType2" />
    </el-scrollbar>
    <div class="m-footer">
      <el-button icon="close" @click="close()">取消</el-button>
      <el-button
        v-if="['add', 'edit'].includes(handleType2)"
        v-auth="['add', 'edit']"
        icon="check"
        type="primary"
        :loading="saveLoading"
        @click="save"
      >
        保存
      </el-button>
    </div>
    <el-dialog title="选择上级机构" v-model="visible" draggable append-to-body align-center
width="80%">
      <selectOrg selection="single" style="height: calc(90vh - 80px)" @select="selectedParentOrg" @close="visible = false" />
    </el-dialog>
  </div>
</template>
<script setup lang="jsx">
import { ref, watchEffect } from 'vue'
import { getOrgById, postSaveOrg } from '@/api/system/org'
import selectOrg from './selectOrg.vue'

const props = defineProps({
  handleType: {
    type: String,
    default: 'add',
  },
  modelValue: {},
})
const emit = defineEmits(['close'])

const formRef = ref()
const saveLoading = ref(false)
const formData = ref({
  parentId: props.modelValue?.parentId,
  parentName: props.modelValue?.parentName,
  enabled: true,
})

const handleType2 = ref(props.handleType)
if (handleType2.value !== 'add') {
  // 查询明细
  getOrgById(props.modelValue.id).then((res) => {
    formData.value = res.data
    if (handleType2.value === 'copy') {
      handleType2.value = 'add'
      formData.value.id = ''
    }
  })
}

// 表单字段根据表单数据变化，有所不同
const columns = ref([])
watchEffect(() => {
  columns.value = [
    {
      prop: 'parentId',
      label: '上级机构id',
      readonly: true,
      slots: {
        append() {
          return <el-button onClick={() => (visible.value = true)}>选择</el-button>
        },
      },
    },
    { prop: 'parentName', label: '上级机构名称', readonly: true },
    { prop: 'code', label: '机构代码', rules: { required: true } },
    { prop: 'name', label: '机构名称', rules: { required: true } },
    { prop: 'enabled', label: '是否启用', type: 'switch' },
  ]
})

const visible = ref(false)

// 选择了上级数据机构
function selectedParentOrg(rows) {
  formData.value.parentId = rows[0].id
  formData.value.parentName = rows[0].name
  visible.value = false
}

// 保存方法
function save() {
  formRef.value.validate().then(() => {
    postSaveOrg(formData.value, {
      loadingRef: saveLoading,
      showSuccessMsg: true,
      successMsg: '保存成功',
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
