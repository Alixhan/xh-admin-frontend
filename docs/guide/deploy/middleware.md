<script setup>
const previewSrcList = ["/image/img.png", "/image/img_1.png"];
</script>

# 部署中间件

:::info 提示
`docker-compose` 结构化的yaml文档可以清晰的了解整个系统容器，所有中间件均采用 `docker compose` 工具部署。

为方便快速搭建环境，我已经将相关部署配置文件放在 [docs/docker/](https://gitee.com/sun-xiaohan/xh-admin-frontend/tree/main/docs/docker)
目录下，直接拷贝至服务器运行即可完成所需中间件的部署。
:::

## 说明

:::tip 有个细节还是必要说下：
`docker compose up` 会创建默认的网络，网络的名称为 `当前compose文件所在文件夹名称_default`，例如此配置文件在data目录下，所以默认网络为
`data_default`。

设置 `COMPOSE_PROJECT_NAME` 环境变量可以定制默认网络名称，本节教程中我设置的是 `xh` ，所以会创建一个 `xh_default` 的网络。

**在同一个配置文件中启动的所有容器默认会加入这个网络，so，容器间互相访问可以直接通过容器 `container_name` 访问，无需额外的配置。**

如本教程中的 `nacos` 和 `xxl-job-admin` 都是直接通过 `mysql8` 来直接访问的。
:::

### 目录结构

```
docker                                   
├─ mysql                               
│  ├─ docker-entrypoint-initdb.d       // 需要初始化的sql放在此目录
│  │  ├─ init_nacos_config.sql        // nacos配置初始化sql
│  │  ├─ init_xh_admin.sql               // 晓寒管理系统初始化sql
│  │  └─ init_xxl_job.sql              // xxl-job配置初始化sql
│  └─ my.cnf                          // mysql配置文件
├─ nginx                               
│  └─ nginx.conf                       // nginx配置文件
├─ .env                                // docker-compose环境变量
└─ docker-compose.yaml                 // docker-compose配置文件
                                                                
```

### 配置文件

主要看下docker-compose.yaml文件：

<<< @/docker/docker-compose.yaml

### 环境变量

docker-compose的环境变量文件为同目录下 .env 文件：

<<< @/docker/.env{txt}

## 开始部署

我们将该文件夹上传至服务器，如放在/data目录下

```sh
$ cd /data && ll -a 
```

输出这些文件

```sh
[root@VM-12-14-opencloudos data]# cd /data && ll -a 
root 4096 Nov  2 20:46 .
root 4096 Nov  3 22:22 ..
root 4179 Nov  2 20:34 docker-compose.yaml
root  125 Nov  2 20:34 .env
root 4096 Nov  2 20:34 mysql
root 4096 Nov  2 20:34 nginx
```

直接执行compose脚本部署：

```sh
$ docker compose up -d
```

会自动下载所有的镜像文件，等待一段时间，咱们中间件的应用就部署好了：
<el-image style="width: 100%;" :src="previewSrcList[0]" :preview-src-list="previewSrcList" fit="cover" :initial-index="
0" alt=""/>

看下容器情况

```sh
$ docker ps -a 
```

<el-image style="width: 100%;" :src="previewSrcList[1]" :preview-src-list="previewSrcList" fit="cover" :initial-index="1" alt="" />

OK，咱们系统所需的中间件已经部署完成。

细心的小伙伴可能发现了，除了创建了容器还创建了一个默认网络， xh_default。
这个网络后面部署咱们应用的微服务时还会用到。

## 中间件访问

| 中间件           | 端口号             | web管理地址                               | 用户名   | 初始密码         |
|---------------|:----------------|---------------------------------------|-------|--------------|
| mysql8.0      | 3306            | 无                                     | root  | 1qaz@WSX#EDC |
| redis         | 6379            | 无                                     | 无     | 无            |
| minio         | 9000,9001       | `http://localhost:9001`               | root  | 1qaz@WSX#EDC |
| xxl-job-admin | 8088            | `http://localhost:8088/xxl-job-admin` | admin | 123456       |
| nacos         | 8848,9848,18080 | `http://localhost:18080`              | nacos | nacos        |
| jenkins       | 8080            | `http://localhost:8080`               | 后续生成  |              |

nginx是反向代理服务器，后续会进行配置

jenkins 是一款 Java 语言编写的开源的持续集成工具，我们主要用这个来做自动化部署微服务。
