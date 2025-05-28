# 获取文件请求链接

所有通过 ^link(Upload 上传) 组件上传的文件，都会被 `文件管理`
菜单管理起来，再访问这些文件时的链接，都应该使用此工具函数获取。  
具有以下特性：

1. 项目中的文件访问都是需要鉴权的，此函数获取的链接会自动拼接鉴权token
2. 支持文件下载和文件预览
3. 对图片文件可以进行压缩输出
4. 可以定义下载文件名
5. 可配置是否禁用协议缓存
6. 可以对视频文件抽帧输出为图片流
7. 支持以文件 `id` 或 `object` 来获取
8. 支持断点续传下载

## 基础使用

:::demo
utils/file-url/basic
:::

## 压缩图片

:::demo
utils/file-url/compress
:::

## 文件下载预览

:::demo
utils/file-url/download
:::

## 参数类型定义

```ts
export interface DownloadParam {
    //文件表ID
    id?: number | string
    //对象存储key
    object?: string
    //下载的文件名
    fileName?: string
    //文件MIME类型
    contentType?: string
    //告诉浏览器如何处理文件流，attachment为下载，inline浏览器在线预览，默认下载
    disposition?: 'attachment' | 'inline'
    //是否压缩显示缩略图，仅图片文件有效
    isScale?: boolean
    //仅图片文件有效，以最长边缩小到此大小等比例缩放,默认60像素，返回图片的缩略图
    scaleWidth?: number
    // 仅视频文件有效，可以传入需要预览视频第几帧图片，响应一个视频对应帧的图片流
    videoFrameNum?: number
    // 是否禁用协议缓存，设置为true时，禁用协商缓存，不会返回304状态码
    noCache?: boolean
}
```
