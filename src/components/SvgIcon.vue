<script lang="tsx">
import { computed, defineComponent, ref, toRef, watchEffect } from 'vue'
import fetchBinary from '@/utils/binary'

/**
 * svg图片使用，可动态修改svg节点属性，改变颜色等
 * 2022-7-10 sunxh
 */
export default defineComponent({
  name: 'MSvgIcon',
  props: {
    src: {
      type: String,
      required: true
    }, // 图标路径
    property: Object, // 修改svg属性值
    inherited: Boolean // 是否继承当前字体颜色
  },
  setup(props) {
    const src = toRef(props, 'src')
    const svgBinary = ref('')
    let fetch: Promise<string>

    watchEffect(async () => {
      fetch = fetchBinary(src.value)
      await fetch
      setBinary()
    })

    function setBinary() {
      fetch.then((data) => (svgBinary.value = data))
    }

    const svg = computed(() => {
      if (!svgBinary.value) return ''
      let svgStr = svgBinary.value
      if (props.property) {
        for (const prop in props.property) {
          let index = 0
          const replaceArr = props.property[prop].split(',')
          svgStr = svgStr.replace(new RegExp(`(?<=${prop}=["'])[^"']*(?=["'])`, 'g'), (str) => {
            const v = replaceArr[index]
            index++
            if (v || v === 0) return v
            return str
          })
        }
      } else if (props.inherited) {
        const regExp = /(?<=fill=["'])[^"']*(?=["'])/g
        svgStr = svgStr.replace(regExp, 'currentColor')
      }
      return svgStr
    })

    return () => <div v-html={svg.value} />
  }
})
</script>
<style scoped lang="scss">
div {
  display: inline-block;
}

::v-deep(svg) {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}
</style>
