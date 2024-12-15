# swagger 文档

^link(swagger) 是一个用于生成、描述和调用 RESTful 接口的 Web 服务。Swagger 遵循了 OpenAPI 规范，OpenAPI 是 Linux 基金会的一个项目，试图通过定义一种用来描述 API 格式或 API 定义的语言，来规范
RESTful 服务开发过程。
通过 swagger 我们可以很方便的生成接口文档，这在前后端分离场景的合作开发中，给前端调试特别方便。

为了生成的规范的 swagger 文档，我们需要先学习 [OpenApi](https://swagger.io/specification/) 规范，同学们可以自行查找资料学习

## 访问swagger文档
在本项目中，启动任意一个后台服务后均会默认启动该服务的 swagger 接口文档服务，访问地址默认为 `服务地址/swagger-ui.html`<br/>
例:在本地启动了 `system` 服务，则可访问 `http://localhost:6002/swagger-ui.html` 来使用swagger 文档了
