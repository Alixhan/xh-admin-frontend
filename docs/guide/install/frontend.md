---
---
<script setup>
const previewSrcList = ["/image/install/img.png"];
</script>
## 前端安装
::: warning 提示
安装前，确保运行环境已经满足需要<br>
`NodeJs 20.x +` <br>
`Pnpm 9.x + `

推荐使用 ^link(nvm) 管理nodejs版本
:::

```shell
# git拉取代码库的代码
git clone https://gitee.com/sun-xiaohan/xh-admin-frontend.git

# 命令行进入项目目录
cd xh-admin-frontend

# 安装npm依赖
pnpm i

# 依赖安装完成后，前端开发环境启动
pnpm dev
```

输出如下表示已启动
```shell
> vite --mode development

  VITE v5.2.11  ready in 1529 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.3.7:5173/
  ➜  press h + enter to show help

[vue-tsc] Found 0 errors. Watching for file changes.

```
打开浏览器，访问 `http://localhost:5173` <br>
如出现登录页，则表示前端项目已启动成功


::: tip 注意
本项目为前后端分离项目，当前只是成功启动前端，并未启动后端服务，若你此时点击获取验证码，或者尝试登录则会报网络错误。

下节我们来启动后端服务。
:::
