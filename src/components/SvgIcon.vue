<script lang="tsx">
import type {PropType} from 'vue'
import {defineComponent, ref, watchEffect} from 'vue'
import binary from '@/utils/binary'

/**
 * svg图片使用，可动态修改svg节点属性，改变颜色等
 * 2022-7-10 sunxh
 */
export default defineComponent({
  name: 'MSvgIcon',
  props: {
    src: {
      type: [String, Promise<String>] as PropType<string | Promise<string>>,
      required: true
    }, // 图标路径
    property: Object, // 修改svg属性值
    inherited: Boolean // 是否继承当前字体颜色
  },
  setup(props) {
    const svg = ref()
    watchEffect(compSvg)

    async function compSvg() {
      let src: string | Promise<string> = props.src
      if (src instanceof Promise) src = await src
      let svgStr: string | undefined = await binary(src)
      if(!svgStr) return
      if (props.property) {
        for (const prop in props.property) {
          svgStr = replaceStr(svgStr, prop, props.property[prop])
        }
      } else if (props.inherited) {
        const regExp = /fill="[^"]*"/g
        const strArr = svgStr.split(regExp)
        svgStr = strArr.join('fill="currentColor"')
      }
      svg.value = svgStr
    }

    function replaceStr(baseStr: string, prop: string, newProps: string) {
      const regExp = new RegExp(prop + '="[^"]*"', 'g')
      const strArr = baseStr.split(regExp)
      const oldColorArr = baseStr.match(regExp)
      const newColorArr = newProps.split(',')
      for (let i = 0; i < newColorArr.length; i++) {
        const color = newColorArr[i]
        if (color && oldColorArr && oldColorArr[i]) {
          oldColorArr[i] = `${prop}="${color}"`
        }
      }
      let str = ''
      for (let i = 0; i < strArr.length; i++) {
        str += strArr[i] + (oldColorArr && oldColorArr[i] ? oldColorArr[i] : '')
      }
      return str
    }

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
