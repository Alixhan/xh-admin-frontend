<template>
  <MSingleDatePicker
    class="date-picker"
    type="datetimerange"
    v-model:start="start"
    v-model:end="end"
    value-format="YYYY-MM-DD HH:mm:ss"
  />
</template>
<script setup>
import { ref } from 'vue'

const start = ref()
const end = ref()
</script>
<style lang="scss" scoped>
.date-picker {
  width: 400px;
}
</style>
