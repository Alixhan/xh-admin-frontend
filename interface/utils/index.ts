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
