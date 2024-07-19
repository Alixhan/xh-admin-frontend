# Upload 上传

上传组件继承自 `ElUpload` 组件，基础用法请参考 [Element Plus](https://element-plus.org/zh-CN/component/upload.html) 官方文档。

为更方便系统使用，组件经过调整增强，和官方组件具有以下几点不同：

1. `autoUpload` 默认为 `false`，此做法是考虑到上传组件集成在表单时，在表单未提交前自动上传会造成大量存储空间浪费，所以上传至服务器的逻辑被调整至表单提交前。
2. 上传至服务器的逻辑已集成进组件内部，无需额外配置。
3. 上传过的文件将在 `系统管理 - 文件管理` 菜单展示记录，且通过sha1算法，保证相同文件只保存一次，节约了存储空间。
4. 新增 `从文件库选择` 功能，可以直接选择已经上传过的文件记录，无需二次上传。
5. 新增 `图片裁剪` 功能，集成 ^link(vue-cropper)  组件，开箱即用。

## 基础用法

:::demo
components/upload/basic
:::

## 图片裁剪

集成 `vue-cropper` 组件满足裁剪需求，更多裁剪参数配置，参考 ^link(vue-cropper)  官方文档
:::demo
components/upload/cropper
:::

## 单文件上传

有时候我们只需要上传单个文件，虽然设置 `limit` 为 `1` 就可实现,但 v-model
绑定数据为数组还是非常不方便，需要编写很多处理的代码，这样导致代码冗余，拉低开发效率，`single` 属性解决了这一困境。
:::demo
components/upload/single
:::

## 手动上传

:::demo
components/upload/manual
:::

## Upload API

### Upload 属性

| 属性名                   | 描述                                                              | 类型                                                     | 默认值   |
|-----------------------|-----------------------------------------------------------------|--------------------------------------------------------|-------|
| model-value / v-model | 绑定的值，`single`为 id 时值为`number`类型, `single`为 object 时值为`string`类型 | ^[string] \| ^[number] \| ^[object]`UploadFileItem []` | —     |
| type                  | 上传的文件类型                                                         | ^['upload-img' \| 'upload-file']                       | —     |
| single                | 单文件上传                                                           | ^['id' \| 'object']                                    | —     |
| auto-upload           | 是否自动上传                                                          | ^[boolean]                                             | false |
| disabled              | 是否禁用                                                            | ^[boolean]                                             | false |
| select-from-lib       | 是否可从文件库直接选择                                                     | ^[boolean]                                             | true  |
| cropper               | 裁剪配置，参考  ^link(vue-cropper)  官方文档配置                             | ^[CropperOption]                                       | —     |
| tip                   | 相当于tip插槽                                                        | ^[string]                                              | —     |

### Upload Slots

| 插槽名 | 详情     | 类型 |
|-----|--------|----|
| tip | 备注信息插槽 | —  |

### Upload Exposes

| 方法名    | 详情         | 类型                               |
|--------|------------|----------------------------------|
| upload | 主动上传文件至服务器 | ^[Function]`() => Promise<void>` |
