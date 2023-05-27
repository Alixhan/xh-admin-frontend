<script lang="jsx">
import { defineComponent, nextTick, shallowRef, watchEffect } from 'vue'
import { useSystemStore } from '@/stores/system'

export default defineComponent({
  setup () {
    const systemStore = useSystemStore()

    const menus = shallowRef()
    watchEffect(initMenus)

    /**
     * 初始化菜单
     */
    function initMenus () {
      menus.value = systemStore.treeMenus.map((i) => generateMenu(i))
    }

    /**
     * 递归生成层级菜单
     */
    function generateMenu (menu) {
      // 只有目录和菜单渲染，其他类型不渲染
      if (!['dir', 'menu'].includes(menu.type)) return
      // 生成菜单图标
      const icon = <m-icon v-model={menu.icon} />
      // 子项包含目录和菜单才视为菜单目录
      const children = menu.children?.filter((i) => ['dir', 'menu'].includes(i.type))
      if (children && children.length) {
        return (
          <el-sub-menu
            index={menu.id + ''}
            v-slots={{
              title: () => {
                return [icon, <span>{menu.title}</span>]
              },
              default: () => children.map((i) => generateMenu(i))
            }}
          />
        )
      } else {
        return (
          <el-menu-item
            index={menu.id + ''}
            v-slots={{
              title: () => {
                return <span>{menu.title}</span>
              },
              default: () => icon
            }}
          />
        )
      }
    }

    const menuParam = {
      class: 'el-menu',
      collapseTransition: false,
      // 选中菜单
      onSelect (index) {
        // 小屏设备收起菜单
        if (systemStore.layout.widthShrink) systemStore.layout.menuCollapse = true
        const menu = systemStore.menus.find((i) => i.id === Number(index))
        if (menu.handleType === 'outer') {
          window.open(menu.outerUrl)
        } else {
          nextTick(() => systemStore.setActiveMenuId(Number(index)))
        }
      }
    }

    return () => (
      <el-scrollbar>
        <el-menu
          {...{
            ...menuParam,
            defaultActive: systemStore.activeMenuId + '',
            collapse: systemStore.layout.menuCollapse
          }}
        >
          {menus.value}
        </el-menu>
      </el-scrollbar>
    )
  }
})
</script>
<style scoped lang="scss">
.el-menu {
  width: 100%;
}
</style>
