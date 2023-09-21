---
---

# 介绍
## 前言

🎉🎉 此项目是一个开源且永久免费的中后台管理系统，项目采用前后端分离架构。 

前端技术栈：
[Vue3](https://cn.vuejs.org)、
[Vite](https://cn.vitejs.dev)、
[Element-plus](https://element-plus.gitee.io/zh-CN/)、
[Pinia](https://pinia.web3doc.top/)、
[Vue-router4](https://router.vuejs.org/zh/)、
[Typescript5](https://www.typescriptlang.org/zh)、
等。

后端技术栈：
[Springboot3](https://spring.io/projects/spring-boot)、
[Java17](https://docs.oracle.com/en/java/javase/17/books.html)、
[Maven](https://maven.apache.org/)、
[Spring-cloud](https://spring.io/projects/spring-cloud)、
[Spring-cloud-alibaba](https://spring.io/projects/spring-cloud-alibaba)、
[Nacos](https://nacos.io/zh-cn/docs/v2/quickstart/quick-start.html)、
[SaToken](https://sa-token.cc/)
等。

## 在线演示

演示地址：   <https://>
::: warning 提示
作为个人开发者，演示站的条件非常有限，请各位大哥大姐们不要瞎玩，做压测啥的，随便整下这个服务器就崩溃了，我先提前谢谢你们哈🌹🌹
:::

## 浏览器兼容性

项目使用vite开发，所以兼容性和vite平齐。<br> 
生产环境的构建包会要求目标浏览器支持现代 JavaScript 语法。默认情况下，Vite 的条件是浏览器能够 [支持原生 ESM script 标签](https://caniuse.com/es6-module)、[支持原生 ESM 动态导入](https://caniuse.com/es6-module-dynamic-import) 和 [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta)：

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

可以通过 [`build.target` 配置项](https://cn.vitejs.dev/config/build-options.html#build-target) 指定构建目标，最低支持 `es2015`。

传统浏览器可以通过插件 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 来支持，此插件将自动生成传统版本的 chunk 及与其相对应 ES 语言特性方面的 polyfill。兼容版的 chunk 只会在不支持原生 ESM 的浏览器中进行按需加载。
