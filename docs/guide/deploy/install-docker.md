---
---

# 安装docker
:::tip 提示
如果docker已安装，可以略过此节。
:::
## 简介
在容器技术出现以前部署一套环境运维花费无数精力不说，搭建好的环境也无法复用迁移，服务器迁移这种工作对于运维人员来说简直就是噩梦。<br>
[`docker`](https://docs.docker.com/get-started)是容器技术的先驱，也是当前最流行的容器产品，容器技术的出现，极大的方便了应用的部署，迁移，复用等。<br>
微服务和容器技术是个好搭档，废话不多说，咱们开始安装 docker 

## 卸载老版本
如果需要先卸载老版本可以：
```sh
$ sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```


## 安装 docker engine
[docker-engine 官方安装文档](https://docs.docker.com/engine/install/centos)

先添加一下包管理器的镜像地址
```sh
$ sudo yum install -y yum-utils
$ sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```
执行安装最新版本docker ce
```sh
$ sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
需要输入两次Y确认安装

如果出现和podman冲突删除podman
```sh
$ sudo yum erase podman buildah
```

## 启动docker服务
```sh
$ sudo systemctl start docker
```

## 查看 docker 版本信息
```sh
$ docker -v
```
Docker version 24.0.7, build afdd53b

成功显示信息则安装启动成功


## 配置开机自启动
大多数当前的 Linux 发行版（RHEL、CentOS、Fedora、Debian、Ubuntu 16.04 及更高版本）用于 systemd 管理系统启动时启动的服务。在 Debian 和 Ubuntu 上，Docker 服务默认配置为在启动时启动。要在引导时为其他发行版自动启动 Docker 和 Containerd，请使用以下命令：
```sh
$ sudo systemctl enable docker.service
$ sudo systemctl enable containerd.service
```
要禁用开机启动，disable 改用。
```sh
$ sudo systemctl disable docker.service
$ sudo systemctl disable containerd.service
```

## 修改docker存储路径
有些时候我们需要修改Docker的存储路径，如果不修改默认/var/lib/docker。

1.修改Docker的存储路径首先需要停止Docker服务。
```sh
$ systemctl stop docker.service
```
2.将当前Docker存储目录复制到 /data目录下
```sh
$ cp -R /var/lib/docker/ /data
```

3.在 daemon.json 文件中，添加或修改 "data-root" 选项，以指向新的存储路径：

vim编辑配置文件，如果不存在的话，会创建
```sh
$ vi /etc/docker/daemon.json
```

daemon.json，加入一下内容
```json
{
  "data-root": "/data/docker"
}
```

4.执行下列命令然后重启docker
```sh
$ sudo systemctl daemon-reload && sudo systemctl enable docker.service && sudo systemctl start docker.service
```

5.查看 docker 安装信息
```sh
$ docker info
```
可以看到 Docker Root Dir 现在指向 /data/docker 了，说明切换成功
