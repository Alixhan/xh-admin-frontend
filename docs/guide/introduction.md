---
---

# 介绍

::: tip
原本只是自己写搭建一个demo学习一些新的技术玩玩，巩固一下自己，后续突发奇想，如果将这个项目开源，那将意义重大，于是着手从头开始，静下心来慢慢从基础架构选择，逐行编写，学习到了很多。

工作时间之余，闲暇时间抽空断断续续写了大概一年，很多时候也想放弃，不仅要学习很多新技术，还有有参考网络上优秀的设计思想，结合自己的想法，从有开源这个想法，到设计架构，代码实现，测试，再到发布，写文档，部署等，深知开源工作的不易。

还好，坚持了下来，回头看看一个人也完成了这么多事情，收获了不少，非常高兴发布项目的第一版本。

`本文档还在陆续完善中~`

:::

🎉🎉 此项目是一个开箱即用的开源中后台管理系统，项目为前后端分离架构。采用最新的技术栈全新构建，纯净的项目代码，不抄录任何原有项目框架，没有历史包袱，拒绝冗余的代码。<br>

借助现代化的开发插件和工具，大大提高开发效率，用此项目二次开发，可以专注业务开发，极大加快项目进度。

## 在线演示

演示地址：   <http://demo.xhansky.cn>， 演示账号：`admin` 密码：`admin123`
::: tip 提示
作为个人开发者，演示站的条件非常有限，请各位同学手下留情，做压测啥的，随便整下这个服务器就崩溃了，我先提前谢谢你们哈🌹🌹
:::

## 浏览器兼容性

项目使用vite构建，所以兼容性和vite平齐。<br> 
生产环境的构建包会要求目标浏览器支持现代 JavaScript 语法。默认情况下，Vite 的条件是浏览器能够 [支持原生 ESM script 标签](https://caniuse.com/es6-module)、[支持原生 ESM 动态导入](https://caniuse.com/es6-module-dynamic-import) 和 [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta)：

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

可以通过 [`build.target` 配置项](https://cn.vitejs.dev/config/build-options.html#build-target) 指定构建目标，最低支持 `es2015`。

传统浏览器可以通过插件 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 来支持，此插件将自动生成传统版本的 chunk 及与其相对应 ES 语言特性方面的 polyfill。兼容版的 chunk 只会在不支持原生 ESM 的浏览器中进行按需加载。

## 交流群

微信群：<br>
(扫码添加微信好友，备注xhan，拉你进群。)<br>
`现在项目刚发布，马上进群，你就是元老！ ✨`

<img src="/image/wechat.png" style="max-width: 300px; width: 100%;">
