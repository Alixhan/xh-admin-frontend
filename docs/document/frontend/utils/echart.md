# EChart 图表

^link(ECharts)
是一个开源的JS图表库，项目提供了一个通用的图表使用辅助工具类来使用它，通用功能已在内部实现，开发者只需实现业务细节即可。
具有以下特点：
1. 切换暗黑主题时，图表会自动切换主题
2. 容器大小变更时，自动调用`resize` 重新适配容器
3. `option` 变动时自动重载图表

## 基础使用

:::demo
utils/echart/basic
:::

## option变更自动重载图表

工具类为自动监听 `Ref<option>` 的变化，自动重载图表
:::demo
utils/echart/basic2
:::

## onInit 回调

第二参数为 `onInit` 回调函数，函数参数为图表的实例对象
:::demo
utils/echart/on-init
:::
