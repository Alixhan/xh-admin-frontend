# 后端规范

制定规范可以带来以下几个好处：

- 一致性和可读性：规范有助于确保代码在整个项目中保持一致。这使得其他开发者更容易理解和参与项目，因为他们可以快速地理解代码的组织方式和意图。
- 可维护性：遵循规范可以提高代码的可维护性。当代码结构和命名约定一致时，定位和修复问题会更容易，因为开发者可以快速地找到相关的代码片段。
- 团队协作：在团队项目中，规范是促进协作的关键。所有团队成员遵循相同的规范，可以减少代码冲突，并确保代码的合并和集成过程更加顺畅。
- 代码重用：编写规范的代码可以提高代码的重用性。如果组件、函数和类的命名和设计符合规范，它们可以更容易地被其他项目或团队成员重用。
- 学习曲线：对于新加入团队的开发者，规范是学习曲线的缓冲器。他们可以更快地熟悉团队的编码风格和实践，从而快速地融入团队。
- 代码审查：规范可以帮助代码审查过程更加高效。审查者可以关注于代码的逻辑和功能，而不必在代码风格或格式上花费太多时间。
- 错误预防：遵循规范可以减少一些常见的错误。例如，变量命名规范可以防止命名冲突，注释规范可以确保代码被正确地文档化。

## 目录结构规范

``` shell
xh-admin-backend/      
├── common                  # 公共依赖
│   |-- common-core/        # 核心依赖
│   |-- common-jdbc/        # 数据库连接
│   |-- common-nacos/       # 启用nacos作为配置中心和注册时中心时引入
│   |-- common-swagger/     # 启用swagger时引入
│   └-- common-xxljob/      # 启用xxl-job时引入
├── generator               # 代码生成
│   |-- client/             # 代码生成client
│   └-- service/            # 代码生成service
├── system                  # 系统管理
│   |-- client/             # 系统管理client
│   └-- service/            # 系统管理service
└── pom.xml                 
```

可以看到本项目已有两个微服务：`代码生成服务(generator)`、`系统管理服务(system)`

- 代码生成服务：主要用于代码生成，一般仅作开发环境生成代码使用。
- 系统管理服务：本开源项目其他所有功能均在此服务实现。

为什么服务要区分 `client`、`service`？

- 此设定是方便在微服务架构模式开发时，各服务间的依赖可以更好的引用协同开发。
- `client` 主要管理 entity(po)、dto、vo、exchange(远程HTTP调用客服端，其他服务引用后可直接跨服务调用)等。
- `service` 主要管理 controller、service、dao等。
- 值得一说的是，以单体架构模式开发无需区分 `client` 和 `service`，可自行删除并合并在一起。

## Getter、Setter

为了保证 `Java` 类文件的简洁，项目引入了 `Lombok` 插件，请使用 `Lombok` 提供的注解自动生成 `Getter`、`Setter` 等方法

```java
package com.xh.system.service;

import lombok.Data;

@Data
public class UserEntity {

    private Integer id;

    private String name;
}
```

## 打印日志

请使用 `Lombok` 提供的 `@Slf4j` 注解自动生成的 `log` 来打印日志。

```java
package com.xh.system.service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class Test {
    public static void main(String[] args) {
        log.info("hello world");
    }
}
```

## 返回类型

为保证前端对响应内容的统一处理，后端 `RestController` 的方法应始终返回 `RestResponse` 类型对象。

```java
package com.xh.system.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import com.xh.common.core.entity.SysLog;
import com.xh.common.core.web.PageQuery;
import com.xh.common.core.web.PageResult;
import com.xh.common.core.web.RestResponse;
import com.xh.system.service.SysLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "系统日志")
@RestController
@RequestMapping("/api/system/log")
public class LogController {

    @Resource
    private SysLogService sysLogService;

    @Operation(description = "日志列表查询")
    @PostMapping("/query")
    @SaCheckPermission("system:log")
    public RestResponse<PageResult<SysLog>> query(@RequestBody PageQuery<Map<String, Object>> pageQuery) {
        PageResult<SysLog> data = sysLogService.query(pageQuery);
        return RestResponse.success(data);
    }

    @SaCheckPermission("system:log:detail")
    @Operation(description = "获取日志详情")
    @GetMapping("/get/{id}")
    public RestResponse<SysLog> getById(@PathVariable Integer id) {
        return RestResponse.success(sysLogService.getById(id));
    }
}

```

## 定义权限

为了防止用户越权访问数据，请为每个 `Controller` 及其方法添加 ^link(Sa-Token) 提供的权限注解，
例： `SaCheckPermission`，保证权限访问安全。

## 公用工具类方法

如需定义公用工具类方法，请先检查 `common/common-core/src/main/java/com/xh/common/core/utils` 包下是否已有公有方法，避免重复定义。
新增公共工具类方法也应放在此包下。

## 新增 Maven 依赖

如果需要新增 `Maven` 依赖，首先应该在 `项目根目录/pom.xml` `dependencyManagement` 节点下声明依赖版本，
并且版本号应该在 `properties` 节点声明变量并引用，这样在具体 pom.xml 文件引入依赖就不用指定版本了。

此做法是为了方便后续的依赖升级，统一管理依赖版本。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <properties>
        <minio.version>8.5.17</minio.version>
    </properties>

    <!--    定义依赖的默认版本    -->
    <dependencyManagement>
        <dependencies>
            <!--     MinIo对象存储       -->
            <dependency>
                <groupId>io.minio</groupId>
                <artifactId>minio</artifactId>
                <version>${minio.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

</project>
```

## 继承公用实体类

一般无特殊需求，一些表基本都会包含 `BaseEntity` 定义的通用字段，请继承此类保证公共字段统一，这种做法在协同开发和后续运维时大大降低开发的心智负担。

一般无特殊需求，实现数据权限的功能表，应继承 `DataPermissionEntity` 类定义的通用字段，，保持表列定义风格的统一，这种做法在协同开发时降低开发同事的心智负担。

## 抛出业务异常

为了非常方便的给前端展示业务错误信息，我们只需要在业务逻辑中抛出 `MyException` 异常即可

```java
/**
 * 用户保存
 */
@Transactional
public SysUser save(SysUser sysUser) {
    String sql = "select count(1) from sys_user where deleted is false and code = ? ";
    if (sysUser.getId() != null) sql += " and id <> " + sysUser.getId();
    Integer count = primaryJdbcTemplate.queryForObject(sql, Integer.class, sysUser.getCode());
    assert count != null;
    if (count > 0) throw new MyException("用户账号%s已存在！".formatted(sysUser.getCode()));
    if (CommonUtil.isNotEmpty(sysUser.getPassword())) {
        // 密码加密
        String pwHash = BCrypt.hashpw(sysUser.getPassword(), BCrypt.gensalt());
        sysUser.setPassword(pwHash);
    }
    if (sysUser.getId() == null) {
        sysUser.setStatus(1);
        baseJdbcDao.insert(sysUser);
    } else {
        SysUser oldUser = baseJdbcDao.findById(SysUser.class, sysUser.getId());
        if (CommonUtil.isNotEmpty(sysUser.getPassword())) {
            if (oldUser.getPassword().equals(sysUser.getPassword()))
                throw new MyException("新密码不能与旧密码相同！");
            //记录密码修改日志
            SysUserPasswordLog passwordLog = new SysUserPasswordLog();
            passwordLog.setSysUserId(sysUser.getId());
            passwordLog.setOldPassword(oldUser.getPassword());
            passwordLog.setOldPassword(sysUser.getPassword());
            baseJdbcDao.insert(passwordLog);
        } else {
            sysUser.setPassword(oldUser.getPassword());
        }
        baseJdbcDao.update(sysUser);
    }
    return sysUser;
}
```

:::danger 注意
抛出业务异常将导致事务回滚。
:::
