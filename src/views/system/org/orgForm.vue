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
        v-auth="['system:org:add', 'system:org:edit']"
        icon="check"
        type="primary"
        :loading="saveLoading"
        @click="save"
      >
        {{ $t('common.save') }}
      </el-button>
    </div>
    <el-dialog
      :title="$t('system.org.selectParent')"
      v-model="visible"
      draggable
      append-to-body
      align-center
      width="80%"
    >
      <selectOrg
        selection="single"
        style="height: calc(90vh - 80px)"
        @select="selectedParentOrg"
        @close="visible = false"
      />
    </el-dialog>
  </div>
</template>
<script setup lang="jsx">
import { ref, toRef, toRefs, watchEffect } from 'vue'
import { getOrgById, postSaveOrg } from '@/api/system/org'
import selectOrg from './selectOrg.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  handleType: {
    type: String,
    default: 'add'
  },
  modelValue: {}
})
const emit = defineEmits(['close'])

const { t } = useI18n()

const formRef = ref()
//初始化加载状态
const formLoading = ref(false)
const saveLoading = ref(false)
const { modelValue } = toRefs(props)
const formData = ref({
  parentId: modelValue.value?.parentId,
  parentName: modelValue.value?.parentName,
  enabled: true
})

const handleType = toRef(props, 'handleType')
if (handleType.value !== 'add') {
  // 查询明细
  formLoading.value = true
  getOrgById(props.modelValue.id).then((res) => {
    formData.value = res.data
    formLoading.value = false
  })
}

// 表单字段根据表单数据变化，有所不同
const columns = ref([])
watchEffect(() => {
  columns.value = [
    {
      prop: 'parentId',
      label: t('system.org.parentId'),
      readonly: true,
      slots: {
        append() {
          return <el-button onClick={() => (visible.value = true)}>{t('common.select')}</el-button>
        }
      }
    },
    { prop: 'parentName', label: t('system.org.parentName'), readonly: true },
    { prop: 'code', label: t('system.org.code'), rules: { required: true } },
    { prop: 'name', label: t('system.org.name'), rules: { required: true } },
    { prop: 'enabled', label: t('common.isEnabled'), type: 'switch' }
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
