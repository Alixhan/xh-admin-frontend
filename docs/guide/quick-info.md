---
---

# 快速了解
## 介绍

🎉🎉 此项目是一个开源且永久免费的中后台管理系统基础解决方案，采用最新技术栈构建，项目采用前后端分离架构。 

**前端技术栈：**
[Vite](https://cn.vitejs.dev)、
[Vue3](https://cn.vuejs.org)、
[Element-plus](https://element-plus.org/)、
[Pinia](https://pinia.web3doc.top/)、
[Vue-router4](https://router.vuejs.org/zh/)、
[Typescript5](https://www.typescriptlang.org/zh)、
等。

**后端技术栈：**
[Java21](https://docs.oracle.com/en/java/javase/21/books.html)、
[Springboot4](https://spring.io/projects/spring-boot)、
[Spring-cloud](https://spring.io/projects/spring-cloud)、
[Spring-cloud-alibaba](https://spring.io/projects/spring-cloud-alibaba)、
[SaToken](https://sa-token.cc/)
等。

**中间件：**
[XXL-JOB 自动程序](https://gitee.com/xuxueli0323/xxl-job)、
[Mysql8 数据库](https://www.mysql.com/)、
[Redis 缓存数据库](https://redis.io/)、
[Nacos 注册配置中心](https://nacos.io/zh-cn/docs/v2/quickstart/quick-start.html)、
[MinIO 文件服务](https://min.io/docs)
等。

**其他：**
[Git 版本控制](https://git-scm.com/)

## 浏览器兼容性

项目使用vite开发，所以兼容性和vite平齐。<br> 
生产环境的构建包会要求目标浏览器支持现代 JavaScript 语法。默认情况下，Vite 的条件是浏览器能够 [支持原生 ESM script 标签](https://caniuse.com/es6-module)、[支持原生 ESM 动态导入](https://caniuse.com/es6-module-dynamic-import) 和 [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta)：

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

可以通过 [`build.target` 配置项](https://cn.vitejs.dev/config/build-options.html#build-target) 指定构建目标，最低支持 `es2015`。

传统浏览器可以通过插件 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 来支持，此插件将自动生成传统版本的 chunk 及与其相对应 ES 语言特性方面的 polyfill。兼容版的 chunk 只会在不支持原生 ESM 的浏览器中进行按需加载。

## 内置功能
* 菜单管理
* 用户管理
* 角色管理
* 机构管理
* 用户组管理
* 文件管理
* 数据字典
* 系统日志
* 数据权限
* 代码生成器
