<template>
  <div class="home-view">
    <top-panel class="desc-view" />
    <statistic class="statistic-view" />
    <charts />
    <todo-list class="todo-list" />
  </div>
</template>
<script lang="ts" setup>
import TodoList from './todoList.vue'
import TopPanel from './topPanel.vue'
import Statistic from './statistic.vue'
import Charts from './charts.vue'
defineOptions({
  name: 'MHome'
})
</script>
<style lang="scss" scoped>
.home-view {
  min-height: var(--main-height);
  border-radius: 5px;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-content: start;

  > div,
  :deep(> div) {
    background-color: var(--el-bg-color);
    border-radius: 10px;
    padding: 20px;
  }

  .desc-view,
  .statistic-view {
    grid-column: 1 / -1;
  }

  .todo-list {
    grid-column-start: span 2;
    height: 250px;
  }

  .statistic-view {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media screen and (max-width: 1200px) {
  .home-view {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    .statistic-view {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

@media screen and (max-width: 600px) {
  .home-view {
    grid-template-columns: minmax(0, 1fr);

    .statistic-view {
      grid-template-columns: minmax(0, 1fr);
    }

    .todo-list {
      grid-column-start: span 1;
    }
  }
}
</style>
