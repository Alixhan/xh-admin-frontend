# 操作数据库

持久化（Persistence），即把数据（如内存中的对象）保存到可永久保存的存储设备中（如磁盘），此节持久化的主要指的是将内存中的对象存储在数据库中。

项目采用 `JdbcTemplate` 作为持久化解决方案，同时封装了 `BaseJdbcDao` 来简化增删改查的操作，提高项目开发效率。

## 为什么不选择 MyBatis ？

作者在开源的过程中，后端被问的做多的就是为啥不是用 `Mybatis` 还有 `Mybatis-plus` 、`Mybatis-flex`等。

国内 mybatis 的流行度非常高，可能是用户习惯养成了，大家普遍认为 mybatis + mybatis plus 是比较好的 ORM
解决方案，本人接触项目大多也确实是 mybatis。

mybatis 最经典的就是配置xml SQL 和 mapper 层映射，在xml 中可以方便的修改 SQL ，
可能是用的时间长了，用户习惯潜移默化的导致了一种思想是：sql不应该写在源代码里面，把 sql 语句写进 xml 被认为是一种更好的规范

但是～ 后面就有人发现，mybatis 这种 xml 模板有点冗余，需要写很多样重复的板代码，挺影响开发效率，于是官方自己后面也支持了在
mapper 类中可直接使用注解的方式编写语句，可以抛弃 xml。

但是后来开发者用下来觉得还不够，所以后面出现了很多如 mybatis plus、 flex 等，这些框架差不多都是一个目标，简化开发，提升开发效率，减少重复的样板代码。

从另一点来看，其实 mybatis 其实就是对 jdbc 高级封装，最后还是会从 xml 模板解析出 SQL 再通过 jdbc
执行 sql 的，本质上来说和直接把 sql 写在源码中并无不同，个人认为这种直接使用语句的方式比学习 xml 模板语法理解学习更简单，灵活，极大降低了学习门槛。

在立项之初我考虑过使用 mybatis ，但是最终还是选择 jdbcTemplate，并且自己封装了一套 BaseJdbcDao 实现可以通过 java
实体直接新增，修改，删除，查询，批量插入等。

<div style="color: red">
做这个开源项目，作者是认真的把工作中遇到的问题，觉得哪些好的地方可以优化的地方在这项目实现的，
其目的是让项目更简单，易用，开发效率更高。

从作者以往的开发经验来看，mybatis 虽然好用，但是可能不是最优解，他仍然有缺点(有点臃肿，有点学习成本等，配置繁琐)
，我们应该从提升代码实际开发体验出发，尝试更多可能。

改变习惯固然很难，但是有时候确实值得。
</div>

## Entity 实体

为了简化增删改查的操作，项目定义了一套 ORM 用于直接使用实体来操作数据库， 定义一个实体非常简单，参照 JPA 标准，定义实体主要使用以下注解：

- @Table
- @Column
- @Id
- @Transient
- @AutoSet

### @Table 表映射

在普通类添加 `@Table` 注解即定义了一个实体，`name` 属性映射指定表名，例：

```java
package com.xh.system.client.entity;

import jakarta.persistence.Table;

@Table(name = "sys_data_entity")
public class SysDataEntity {

    private String id;

    private String dataName;
}
```

`name` 属性可以省略，当 `@Table` 注解不指定 `name` 属性，则默认使用映射表名为`Class`类名驼峰转为小写下划线格式，以下示例和上述示例映射的表名完全相同。

```java
package com.xh.system.client.entity;

import jakarta.persistence.Table;

@Table //默认映射 sys_data_entity 表
public class SysDataEntity {

    private String id;

    private String dataName;
}
```

### @Column 列映射

`@Column` 注解用于映射 java 字段到数据库表字段，`name` 属性映射指定的表字段名，例：

```java
package com.xh.system.client.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Table;

@Table
public class SysDataEntity {

    @Column(name = "id")
    private String id;

    @Column(name = "data_name")
    private String dataName;
}  
```

`@Column` 注解一样可以省略，如果 java 类字段省略 `@Column` 注解， 则自动映射数据表字段名为 java
类字段名驼峰转为小写下划线格式，以下示例和上述示例映射的列名完全相同。

```java
package com.xh.system.client.entity;

import jakarta.persistence.Table;

@Table
public class SysDataEntity {

    private String id;

    private String dataName;
}  
```

### @Id 主键

`@Id` 注解用于指定该字段为主键，如下示例，表示 id 字段为主键：

```java
package com.xh.system.client.entity;

import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Table
public class SysDataEntity {

    @Id
    private String id;

    private String dataName;
}
```

### @Transient 虚拟列

有时候，实体类可能需要一些虚拟字段，实际的数据库表中并不存在该列，可以通过 `@Transient` 注解标识：

```java
package com.xh.system.client.entity;

import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Table
public class SysDataEntity {

    @Id
    private String id;

    private String dataName;

    @Transient
    private Double testField;
}
```

### @AutoSet 自动注入

在实际的使用中，我们经常需要给实体自动设置一些值，例如：在插入实体时，自动设置创建时间为当前时间，创建人为当前登录用户ID。

`@AutoSet` 注解接收一个 `AutoSetFun` 数组可用于标识字段，在持久化操作运行时，利用反射依次执行 `AutoSetFun` 一些自动化设值操作，例：

```java
package com.xh.system.client.entity;

import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Table
public class SysDataEntity {

    @Id
    private String id;

    private String dataName;

    //创建时自动设置创建时间
    @AutoSet(AutoSetFun.INSERT_NOW)
    private LocalDateTime createTime;

    //修改时自动设置修改时间
    @AutoSet(AutoSetFun.UPDATE_NOW)
    private LocalDateTime updateTime;

    //创建时自动设置创建人ID
    @AutoSet(AutoSetFun.INSERT_BY)
    private Integer createBy;
}
```

`AutoSetFun` 已经内置了许多自动注入值的逻辑，满足大部分应用场景，已内置：

- `AutoSetFun.INSERT_NOW` 新增时并且当字段为 `null` 时自动添时间为当前时间，仅 `LocalDate` 或 `LocalDateTime` 类型生效
- `AutoSetFun.UPDATE_NOW` 修改时自动添时间为当前时间，仅 `LocalDate` 或 `LocalDateTime` 类型生效
- `AutoSetFun.INSERT_BY` 新增时并且字段值为 `null` 时，自动添加当前登录人员ID，仅 `Integer` 类型有效
- `AutoSetFun.UPDATE_BY` 修改时，自动更新为当前登录人ID，仅 `Integer` 类型有效
- `AutoSetFun.CURRENT_ORG` 实体保存时，如果字段为 `null` ，设置字段值为当前使用岗位机构id
- `AutoSetFun.CURRENT_ROLE` 实体保存时，如果字段为 `null` ，设置字段值为当前使用岗位角色id
- `AutoSetFun.DEFAULT_FALSE` 当字段值为 `null` ，设置默认值为 `false`

有特殊要求的，可自行在 `AutoSetFun` 定制自定义注入规则。

### 继承

有时候多张表会有一些公用的字段，如创建时间，修改时间等，那么可以通过 java
的继承特性，定义一个父类来声明公用字段，其他类通过继承父类获取公用字段。

```java
/**
 * 父类
 */
public class BaseEntity {
    //创建时自动设置创建时间
    @AutoSet(AutoSetFun.INSERT_NOW)
    private LocalDateTime createTime;

    //修改时自动设置修改时间
    @AutoSet(AutoSetFun.UPDATE_NOW)
    private LocalDateTime updateTime;

    //创建时自动设置创建人ID
    @AutoSet(AutoSetFun.INSERT_BY)
    private Integer createBy;
}


/**
 * 子类继承获取父类字段
 */
@Table
public class SysDataEntity extends BaseEntity {

    @Id
    private String id;

    private String dataName;
}

/**
 * 子类继承获取父类字段
 */
@Table
public class TestEntity extends BaseEntity {

    @Id
    private String id;

    private String name;
}
```

上述示例，`SysDataEntity` 和 `TestEntity` 具有相同的公用字段。

:::warning 注意
如果子类字段和父类重复，则子类会覆盖父类的定义。
:::

项目中已经内置定义了一些公用 `Entity` :

- `BaseEntity.java` 基础公用字段
- `DataPermissionEntity.java` 数据权限公用字段，用于数据权限实现

## BaseJdbcDao

`BaseJdbcDao` 实际是对 `JdbcTemplate` 的封装，以此实现了一套非常简易的方法来操作实体，通过 `BaseJdbcDao`
，我们可以很方便的进行基础增删改查等操作。

相较于其他 ORM 框架，该实现最方便的点是：所有增删改查泛型均定义在方法级别，这样无需定义类级别的 mapper，
即可操作任意类型实体，极大减少冗余代码，提高开发效率。

先定义一个实体，后续的示例会用到此实体，实体的 `getter`、`setter`、构造函数由 `lombok` 插件自动创建，并具有一个 `name`
参数的构造函数：

```java
package com.xh.system.service;

import com.xh.common.core.entity.AutoSet;
import com.xh.common.core.entity.AutoSetFun;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Table
@Data
@NoArgsConstructor
public class UserEntity {

    @Id
    private Integer id;

    private String name;

    @AutoSet(AutoSetFun.INSERT_NOW)
    private LocalDateTime createTime;

    @AutoSet(AutoSetFun.UPDATE_NOW)
    private LocalDateTime updateTime;

    public UserEntity(String name) {
        this.name = name;
    }
}

```

### insert 插入

```java
package com.xh.system.service;

import com.xh.common.core.dao.BaseJdbcDao;
import jakarta.annotation.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

@Service
public class TestService {

    @Resource
    protected BaseJdbcDao baseJdbcDao;

    @Resource(name = "secondJdbcTemplate")
    protected JdbcTemplate secondJdbcTemplate;

    @Transactional
    public void createUser() {
        UserEntity user1 = new UserEntity("晓寒");
        //执行插入
        baseJdbcDao.insert(user1);
        //打印生成的字自增ID
        System.out.printf(user1.getId().toString());

        UserEntity[] user1s = {
                new UserEntity("晓寒"),
                new UserEntity("张三"),
                new UserEntity("李四"),
        };
        //批量插入
        baseJdbcDao.insert(user1s);
        //打印批量插入生成的自增ID
        Arrays.stream(user1s).map(UserEntity::getId).forEach(System.out::println);


        UserEntity user2 = new UserEntity("晓寒");
        //执行插入，指定数据源
        baseJdbcDao.insert(secondJdbcTemplate, user2);
        //打印生成的字自增ID
        System.out.printf(user2.getId().toString());

        UserEntity[] user2s = {
                new UserEntity("晓寒"),
                new UserEntity("张三"),
                new UserEntity("李四"),
        };
        //批量插入指定数据源
        baseJdbcDao.insert(secondJdbcTemplate, user2s);
        //打印批量插入生成的自增ID
        Arrays.stream(user2s).map(UserEntity::getId).forEach(System.out::println);
    }
}
```

值得注意的是，在批量插入多行实体数据时，为了减少频繁执行 sql，该方法将生成以下批量插入语句，以提高性能：

```sql
INSERT INTO 表名 (列1, 列2)
VALUES (值1, 值2),
       (值3, 值4), ...;
```

### update 更新

```java
package com.xh.system.service;

import com.xh.common.core.dao.BaseJdbcDao;
import jakarta.annotation.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TestService {

    @Resource
    protected BaseJdbcDao baseJdbcDao;

    @Resource(name = "secondJdbcTemplate")
    protected JdbcTemplate secondJdbcTemplate;

    @Transactional
    public void updateUser() {
        //假设数据库有一条 ID 为 1 的数据
        UserEntity user = new UserEntity();
        user.setId(1);
        user.setName("xh");
        //执行更新
        baseJdbcDao.update(user);

        //指定数据源更新
        baseJdbcDao.update(secondJdbcTemplate, user);
    }
}
```

### findById 通过主键获取实体

```java
package com.xh.system.service;

import com.xh.common.core.dao.BaseJdbcDao;
import jakarta.annotation.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class TestService {

    @Resource
    protected BaseJdbcDao baseJdbcDao;

    @Resource(name = "secondJdbcTemplate")
    protected JdbcTemplate secondJdbcTemplate;

    public void findUser() {
        //假设数据库有一条 ID 为 1 的数据

        //通过主键获取User
        UserEntity user = baseJdbcDao.findById(UserEntity.class, 1);

        //通过主键获取User，指定数据源
        UserEntity user2 = baseJdbcDao.findById(UserEntity.class, secondJdbcTemplate, 1);
    }
}
```

### deleteById 通过主键物理删除

```java
package com.xh.system.service;

import com.xh.common.core.dao.BaseJdbcDao;
import jakarta.annotation.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TestService {

    @Resource
    protected BaseJdbcDao baseJdbcDao;

    @Resource(name = "secondJdbcTemplate")
    protected JdbcTemplate secondJdbcTemplate;

    @Transactional
    public void deleteUser() {
        //假设数据库有一条 ID 为 1 的数据

        //通过主键删除User
        baseJdbcDao.deleteById(UserEntity.class, 1);

        //通过主键删除User，指定数据源
        baseJdbcDao.deleteById(UserEntity.class, secondJdbcTemplate, 1);
    }
}
```

### findBySql 通过 sql 语句获取第一条数据

- 当查询结果为空时，该方法将返回 `null`
- 当查询 sql 查询结果有多条时，则返回第一条数据
- 为了减少不必要的开销，建议 sql 语句添加 `limit 1` 手动筛选第一条

```java
package com.xh.system.service;

import com.xh.common.core.dao.BaseJdbcDao;
import jakarta.annotation.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TestService {

    @Resource
    protected BaseJdbcDao baseJdbcDao;

    @Resource(name = "secondJdbcTemplate")
    protected JdbcTemplate secondJdbcTemplate;

    @Transactional
    public void findUser() {
        //假设数据库有一条 ID 为 1 的数据

        String sql = "select * from user_entity where id = ?";

        //通过sql语句获取记录，如查询到多行则会返回第一行数据
        UserEntity user = baseJdbcDao.findBySql(UserEntity.class, sql, 1);

        //通过sql语句获取记录，指定数据源，如查询到多行则会返回第一行数据
        UserEntity user2 = baseJdbcDao.findBySql(UserEntity.class, sql, secondJdbcTemplate, 1);
    }
}
```

### findList 通过 sql 获取列表数据

```java
package com.xh.system.service;

import com.xh.common.core.dao.BaseJdbcDao;
import jakarta.annotation.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class TestService {

    @Resource
    protected BaseJdbcDao baseJdbcDao;

    @Resource(name = "secondJdbcTemplate")
    protected JdbcTemplate secondJdbcTemplate;

    @Transactional
    public void findList() {
        //假设数据库有一条 ID 为 1 的数据

        String sql = "select * from user_entity";

        //通过sql语句获取多行记录
        List<UserEntity> users = baseJdbcDao.findList(UserEntity.class, sql);

        //也可传 Map返回 Map 类型数据
        List<Map> users2 = baseJdbcDao.findList(Map.class, sql);

        //通过sql语句获取多行记录，指定数据源
        List<UserEntity> users3 = baseJdbcDao.findList(UserEntity.class, sql, secondJdbcTemplate);
    }
}
```

### query 分页查询

方法接受一个 `PageQuery` 类型参数，并返回 `PageResult` 分页结果

此方法和前端列表查询高度协同，还可实现更加复杂的高级筛选。

```java
package com.xh.system.service;

import com.xh.common.core.dao.BaseJdbcDao;
import com.xh.common.core.web.PageQuery;
import com.xh.common.core.web.PageResult;
import jakarta.annotation.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class TestService {

    @Resource
    protected BaseJdbcDao baseJdbcDao;

    @Resource(name = "secondJdbcTemplate")
    protected JdbcTemplate secondJdbcTemplate;

    @Transactional
    public void queryUser() {
        String sql = "select * from user_entity where name like '%'?'%'";

        PageQuery<?> pageQuery = new PageQuery<>();
        pageQuery.setBaseSql(sql); //基础查询sql
        pageQuery.setIsPage(true); //设置是否分页
        pageQuery.setCurrentPage(1); //当前页码
        pageQuery.setPageSize(10); //页面大小
        pageQuery.setOrderProp("id"); //排序字段
        pageQuery.addArg("张三"); //添加占位符参数
        pageQuery.setOrderDirection(PageQuery.OrderDirection.desc); // 降序排序

        //默认返回Map类型数据
        PageResult<Map> result = baseJdbcDao.query(pageQuery);
        //打印总条数
        System.out.printf(result.getTotal().toString());
        //当前页数据
        List<Map> list = result.getList();

        //返回指定类型
        PageResult<UserEntity> result2 = baseJdbcDao.query(UserEntity.class, pageQuery);
        //打印总条数
        System.out.printf(result2.getTotal().toString());
        //当前页数据
        List<UserEntity> list2 = result2.getList();

        //指定数据源分页查询
        PageResult<UserEntity> result3 = baseJdbcDao.query(UserEntity.class, pageQuery, secondJdbcTemplate);
        //打印总条数
        System.out.printf(result3.getTotal().toString());
        //当前页数据
        List<UserEntity> list3 = result3.getList();
    }
}
```
