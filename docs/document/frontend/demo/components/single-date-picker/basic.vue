<template>
  <div class="el-text">
    <div>
      <div>daterange：</div>
      <MSingleDatePicker class="date-picker" type="daterange" value-format="YYYY-MM-DD" v-model:start="start1" v-model:end="end1" />
    </div>
    <div>
      <div>datetimerange：</div>
      <MSingleDatePicker class="date-picker" type="datetimerange" v-model:start="start2" v-model:end="end2" />
    </div>
    <div>
      <div>monthrange：</div>
      <MSingleDatePicker class="date-picker" type="monthrange" v-model:start="start3" v-model:end="end3" />
    </div>
  </div>
</template>
<script setup lang="tsx">
import { ref } from 'vue'
import MSingleDatePicker from '@/components/form/SingleDatePicker.vue'

const start1 = ref()
const end1 = ref()
const start2 = ref()
const end2 = ref()
const start3 = ref()
const end3 = ref()
</script>
<style lang="scss" scoped>
.el-text {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  > div {
    display: inline-flex;
    align-items: center;

    > div:first-child {
      width: 100px;
    }
  }

  .date-picker {
    width: 300px;
  }
}
</style>
