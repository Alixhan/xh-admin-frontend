<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll">
      <m-form
        ref="formRef"
        :colspan="24"
        :columns="columns"
        :model="formData"
        :handleType="handleType2"
        :loading="formLoading"
      />
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
    <el-dialog title="选择数据字典类型" v-model="visible1" draggable destroy-on-close align-center
:close-on-click-modal="false" width="70%">
      <selectDictType selection="single" style="height: calc(90vh - 80px)" @select="selectedDictType" @close="visible1 = false" />
    </el-dialog>
    <el-dialog
      title="选择上级字典"
      v-model="visible2"
      draggable
      destroy-on-close
      append-to-body
      align-center
      :close-on-click-modal="false"
      width="70%"
    >
      <selectDictDetail
        selection="single"
        style="height: calc(90vh - 80px)"
        :param="{ dictTypeId: formData.sysDictTypeId }"
        @select="selectedParentDict"
        @close="visible2 = false"
      />
    </el-dialog>
  </div>
</template>
<script setup lang="jsx">
import { ref, watchEffect } from 'vue'
import { getDictDetailById, postSaveDictDetail } from '@/api/system/dict'
import selectDictType from './selectDictType.vue'
import selectDictDetail from './selectDictDetail.vue'

const props = defineProps({
  handleType: {
    type: String,
    default: 'add'
  },
  modelValue: {}
})
const emit = defineEmits(['close'])

//初始化加载是否完成
const formLoading = ref(false)
const formRef = ref()
const saveLoading = ref(false)
const formData = ref({
  sysDictTypeId: props.modelValue?.dictTypeId,
  dictTypeName: props.modelValue?.dictTypeName,
  enabled: true
})

const handleType2 = ref(props.handleType)
if (handleType2.value !== 'add') {
  // 查询明细
  formLoading.value = true
  getDictDetailById(props.modelValue.id).then((res) => {
    formData.value = res.data
    if (handleType2.value === 'copy') {
      handleType2.value = 'add'
      formData.value.id = ''
    }
    formLoading.value = false
  })
}

// 表单字段根据表单数据变化，有所不同
const columns = ref([])
watchEffect(() => {
  columns.value = [
    {
      prop: 'sysDictTypeId',
      label: '字典类型ID',
      rules: { required: true, trigger: 'change' },
      slots: {
        append() {
          return <el-button onClick={() => (visible1.value = true)}>选择</el-button>
        }
      }
    },
    { prop: 'dictTypeName', label: '字典类型名称', readonly: true },
    {
      prop: 'parentId',
      label: '上级id',
      readonly: true,
      slots: {
        append() {
          return <el-button onClick={() => (visible2.value = true)}>选择</el-button>
        }
      }
    },
    { prop: 'parentLabel', label: '上级字典名称', readonly: true },
    { prop: 'value', label: '字典值key', rules: { required: true } },
    { prop: 'label', label: '字典名称', rules: { required: true } },
    { prop: 'order', label: '排序号' },
    { prop: 'enabled', label: '是否启用', type: 'switch' }
  ]
})

const visible1 = ref(false)
const visible2 = ref(false)

// 选择了数据字典类型
function selectedDictType(rows) {
  formData.value.sysDictTypeId = rows[0].id
  formData.value.dictTypeName = rows[0].name
  formData.value.parentId = ''
  formData.value.parentLabel = ''
  visible1.value = false
}

// 选择了上级数据字典
function selectedParentDict(rows) {
  formData.value.sysDictTypeId = rows[0].dictTypeId
  formData.value.dictTypeName = rows[0].dictTypeName
  formData.value.parentId = rows[0].id
  formData.value.parentLabel = rows[0].label
  visible2.value = false
}

// 保存方法
function save() {
  formRef.value.validate().then(() => {
    postSaveDictDetail(formData.value, {
      loadingRef: saveLoading,
      showSuccessMsg: true,
      successMsg: '保存成功'
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
