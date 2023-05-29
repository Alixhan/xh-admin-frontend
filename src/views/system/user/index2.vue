<script lang="jsx">
import { reactive, ref } from 'vue'
export default {
  setup() {
    const data = ref([])
    const num = ref(1)
    const formData = reactive({
      a: 'fsdfsdf',
      b: '所经历的副科级塑料袋封口吉林科技'
    })

    function add() {
      for (let i = 0; i < num.value; i++) {
        data.value.push({ ...formData })
      }
    }

    function getColumns() {
      const s = []
      for (let i = 0; i < 10; i++) {
        const slos = {
          default(scope) {
            return <el-input v-model={scope.row.b} />
          }
        }
        s.push(<el-table-column label="测试列" prop="b" v-slots={slos} />)
      }
      return s
    }

    const sdfs = {
      default(scope) {
        return (
          <el-select v-model={scope.row.b}>
            <el-option label="123" value="1" />
            <el-option label="jhgfd" value="2" />
          </el-select>
        )
      }
    }

    return () => (
      <div>
        <el-button onClick={add}>添加数据</el-button>
        <el-input v-model={num.value} />
        <el-table data={data.value}>
          <el-table-column label="测试列" prop="b" v-slots={sdfs} />
          <el-table-column type="index" label="序" />
          {getColumns()}
        </el-table>
      </div>
    )
  }
}
</script>
<style lang="scss" scoped></style>
