---
---
<script setup>
const previewSrcList = ["/image/img_8.png"];
</script>
# 安装
## 前端运行
::: warning 提示
运行前，确认前端运行环境已经满足需要<br>
`NodeJs 20.x +` <br>
`pnpm 9.x +`

推荐使用 ^link(nvm) 管理nodejs版本
:::

`git` 拉取代码
::: code-group
```shell [gitee]
$ git clone https://gitee.com/sun-xiaohan/xh-admin-frontend.git
```
```shell [github]
$ git clone https://github.com/Alixhan/xh-admin-frontend.git
```
:::


强烈建议使用 [pnpm](https://pnpm.io/) 替代 `npm`，如未安装 `pnpm`，执行下列命令安装
```shell
# 安装 pnpm
$ npm install pnpm -g
```

::: code-group
```shell [npm]
# 命令行进入项目目录
$ cd xh-admin-frontend

# 安装依赖
$ npm i

# 依赖安装完成后，前端开发环境启动
$ npm run dev
```
```shell [pnpm]
# 命令行进入项目目录
$ cd xh-admin-frontend

# 安装依赖
$ pnpm i

# 前端开发环境启动
$ pnpm dev
```
:::

输出如下表示已启动
```console
> vite --mode development

  VITE v5.2.11  ready in 1529 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.3.7:5173/
  ➜  press h + enter to show help

[vue-tsc] Found 0 errors. Watching for file changes.

```
打开浏览器，访问 `http://localhost:5173` <br>
如出现登录页，恭喜你，前端项目已经启动成功！


::: tip 注意
本项目为前后端分离项目，当前只是成功启动前端，并未启动后端服务，若你此时点击获取验证码，或者尝试登录则会报网络错误。

若你只想启动前端，不想本地启动后端服务，可以将前端配置文件中的地址改为演示站的服务地址，直接移步[前端配置访问演示站服务](#前端配置访问演示站服务)
:::

## 后端运行

::: warning 提示
运行前，确认后端运行环境已经满足需要<br>
`JDK 21 +` <br>
`Maven 3.8 +` <br>
`MySql 8.0 +` <br>
`Redis 6.0 +` <br>
`Nacos 2.2 +` (非必须，参考[以单体架构本地配置文件运行](#以单体架构运行))<br>
:::

git 拉取代码
::: code-group
```shell [gitee]
# git拉取后端代码库的代码
git clone https://gitee.com/sun-xiaohan/xh-admin-backend.git
```
```shell [github]
# git拉取后端代码库的代码
$ git clone https://github.com/Alixhan/xh-admin-backend.git
```
:::

**运行模块**

- SystemApplication [系统服务] （<font color=Red>必须</font>）
- GeneratorApplication [代码生成服务] （可选）
::: tip 提示
后端默认集成了 `nacos` 作为配置中心和注册中心，启动前先配置好`nacos`，初始化好`nacos`配置数据库和系统初始数据，并在配置中心配置好相关项目配置。
  
如若仅希望使用本地配置文件启动单体架构的服务，可以免去`nacos`的配置直接启动，参考[以单体架构本地配置文件运行](#以单体架构运行)

如用 `docker` 部署，可直接参考 [部署中间件](/guide/deploy/middleware)
:::

## 前端配置访问演示站服务
如若仅想启动前端服务，不启动后端服务，可配置直接访问演示站的后端服务 <br>
在前端项目根目录新建文件 `.env.development.local `
内容添加如下：
```
# 演示站api地址
VITE_BASE_URL=http://demo.xhansky.cn/frontend-api

# system服务请求前缀
VITE_SYSTEM_BASE_URL=/system-service
# generator服务请求前缀
VITE_GENERATOR_BASE_URL=/generator-service
```

前端服务会自动重启，控制台输出如下：
```console
09:48:26 [vite] .env.development.local changed, restarting server...
09:48:27 [vite] server restarted.
```
演示站账号：`admin` 密码：`admin123`

## 以单体架构运行
本项目为了方便后续 `spring cloud` 集成，默认使用 ^link(Nacos) 作为配置中心和注册中心，考虑到部分用户不方便部署 `nacos`，
于是将这部分配置抽离至 `common-nacos` 模块，此模块依赖默认已经引入。

若想使用本地配置文件以单体架构直接运行服务，只需将 `common-nacos` 依赖移除即可，如下图所示，
移除或注释 `system-service` pom文件的 `common-nacos` 依赖，reload maven，然后启动服务即可不依赖`nacos`直接运行， `generator` 服务也是一样的道理：
<el-image style="width: 100%;" :src="previewSrcList[0]" :preview-src-list="previewSrcList" fit="cover" :initial-index="0" alt="" />
