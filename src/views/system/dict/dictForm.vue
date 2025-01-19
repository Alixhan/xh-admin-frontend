<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll" max-height="75vh">
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
      <template v-if="!formLoading">
        <el-button
          v-if="['add', 'edit'].includes(handleType)"
          v-auth="['system:dict:add', 'system:dict:edit']"
          icon="check"
          type="primary"
          :loading="saveLoading"
          @click="save"
        >
          {{ $t('common.save') }}
        </el-button>
      </template>
    </div>
    <el-dialog
      :title="$t('system.dict.selectDictType')"
      v-model="visible1"
      draggable
      destroy-on-close
      align-center
      :close-on-click-modal="false"
      width="1000px"
      append-to-body
    >
      <selectDictType
        selection="single"
        style="height: calc(90vh - 80px)"
        @select="selectedDictType"
        @close="visible1 = false"
      />
    </el-dialog>
    <el-dialog
      :title="$t('system.dict.selectParent')"
      v-model="visible2"
      draggable
      destroy-on-close
      append-to-body
      align-center
      :close-on-click-modal="false"
      width="1000px"
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
import { ref, toRef, watchEffect } from 'vue'
import { getDictDetailById, postSaveDictDetail } from '@/api/system/dict'
import selectDictType from './selectDictType.vue'
import selectDictDetail from './selectDictDetail.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  handleType: {
    type: String,
    default: 'add'
  },
  modelValue: {}
})

const { t } = useI18n()
const emit = defineEmits(['close'])

//初始化加载是否完成
const formLoading = ref(false)
const formRef = ref()
const saveLoading = ref(false)
const formData = ref({
  sysDictTypeId: toRef(props, 'modelValue').value.dictTypeId,
  dictTypeName: toRef(props, 'modelValue').value.dictTypeName,
  enabled: true
})

const handleType = toRef(props, 'handleType')
if (handleType.value !== 'add') {
  // 查询明细
  formLoading.value = true
  getDictDetailById(props.modelValue.id).then((res) => {
    formData.value = res.data
    formLoading.value = false
  })
}

const visible1 = ref(false)
const visible2 = ref(false)

// 表单字段根据表单数据变化，有所不同
const columns = ref([])
watchEffect(() => {
  columns.value = [
    {
      prop: 'sysDictTypeId',
      label: t('system.dict.dictTypeId'),
      rules: { required: true, trigger: 'change' },
      slots: {
        append() {
          return <el-button onClick={() => (visible1.value = true)}>{t('common.select')}</el-button>
        }
      }
    },
    { prop: 'dictTypeName', label: t('system.dict.dictTypeName'), readonly: true },
    {
      prop: 'parentId',
      label: t('system.dict.parent'),
      readonly: true,
      slots: {
        append() {
          return <el-button onClick={() => (visible2.value = true)}>{t('common.select')}</el-button>
        }
      }
    },
    { prop: 'parentLabel', label: t('system.dict.parentName'), readonly: true },
    { prop: 'value', label: t('system.dict.value'), rules: { required: true } },
    { prop: 'label', label: t('system.dict.labelName'), rules: { required: true } },
    { prop: 'order', label: t('common.order') },
    { prop: 'enabled', label: t('common.isEnabled'), type: 'switch' }
  ]
})

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
  formRef.value.submit().then(() => {
    postSaveDictDetail(formData.value, {
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
