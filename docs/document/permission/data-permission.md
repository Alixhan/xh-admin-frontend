<script setup>
const previewSrcList = ["/image/img_2.png", "/image/img_9.png", "/image/img_10.png", "/image/img_11.png", "/image/img_12.png", "/image/img_13.png", "/image/img_14.png", "/image/img_15.png"];
</script>
# 数据权限（行数据权限）
作者在之前的工作中，深感数据权限实现的复杂，配置繁琐，灵活性不足，所以在开源此项目时对于数据权限的实现逻辑吸取了之前的经验并经过深思熟虑，尽量保证配置简单，灵活，功能强大。

如果您有更好的建议，欢迎留言提出来。

在讲解数据权限实现原理之前，相信你已经对本管理系统的权限有个大致的认知：
- 要让一个用户可以使用系统，必须给用户分配机构角色。
- 一个用户可以拥有多个机构角色，在使用系统时可以动态切换角色。
- 给角色分配权限，如菜单权限，按钮权限，数据权限，这样用户就拥有对应权限使用系统了。

## 概念
数据权限是指对特定数据的访问和操作权限，包括读取、修改、删除等操作。它决定了哪些用户或角色可以访问、修改或删除特定的数据项。数据权限通常更细粒度，可以具体到记录级别的访问控制。

区分于菜单按钮权限，数据权限主要针对系统中的数据，而菜单权限则针对系统的功能菜单或操作选项。

举例场景：XHan Admin管理系统的系统日志菜单，对于系统管理员应该可查看所有日志，而部门负责人可以查看本部门成员产生的日志，其他人员仅可查看自己产生的日志。

## 实现原理
对数据权限的控制实现其实就是对sql查询语句where条件的控制实现

为了使数据权限更加简单灵活，主要由 `人员ID`、`机构ID`、`角色ID` 三个条件自由组合的逻辑表达式动态生成权限sql 

可在 `数据权限` 菜单维护维护自定义的数据权限。

`数据权限` 菜单已经内置维护好一下数据权限，方便直接使用
- 仅可查看本人数据
- 仅可见本机构数据
- 仅可见当前角色数据
- 可查看本机构及下属机构数据
- 可查看当前角色及下属角色的数据

后端提供了一个方法，专门用于获取数据权限的条件sql，获取数据权限sql非常简单，以系统日志查询为例：
```java
// 查询语句
String sql = "select * from sys_log a where 1=1 ";

// 数据权限
String permissionSql = commonService.getPermissionSql("sys_log", "a.create_by", "a.sys_role_id", "a.sys_org_id");
if (CommonUtil.isNotEmpty(permissionSql)) {
    sql += " and %s".formatted(permissionSql);
}

// 如果你只想用人员ID，或者角色ID来控制，其他字段可以传 null，权限sql在生成时遇到字段为 null 会始终判断为真
String permissionSql = commonService.getPermissionSql("sys_log", "a.create_by", null, null);
```
方法参数如下：
<el-image style="width: 100%;" :src="previewSrcList[0]" :preview-src-list="previewSrcList" fit="cover" :initial-index="0" alt="" />


## 如何使用
### 1、创建数据实体
数据实体表为 'sys_data_entity'，直接在数据库手动插入即可<br/>
建议数据实体的id直接填写对应表名，方便使用时一目了然，例如：<br>
<el-image style="width: 100%;" :src="previewSrcList[1]" :preview-src-list="previewSrcList" fit="cover" :initial-index="1" alt="" />

### 2、维护数据权限
:::tip 提示
如无特殊要求，可直接使用已有的权限，大多数场景都可以满足。
:::
在 `数据权限` 菜单维护维护自定义的数据权限。
<el-image style="width: 100%;" :src="previewSrcList[3]" :preview-src-list="previewSrcList" fit="cover" :initial-index="3" alt="" />

### 3、维护角色的数据权限
在 `角色管理` 菜单，维护对应角色的数据权限：
<el-image style="width: 100%;" :src="previewSrcList[2]" :preview-src-list="previewSrcList" fit="cover" :initial-index="2" alt="" />
:::danger 注意
如果未给角色维护数据权限，则默认不做数据权限控制！
:::
### 4、后端拼接权限sql
调用公用方法，拼接权限sql:
```java
// 查询语句
String sql = "select * from sys_log a where 1=1 ";

// 数据权限
String permissionSql = commonService.getPermissionSql("sys_log", "a.create_by", "a.sys_role_id", "a.sys_org_id");
if (CommonUtil.isNotEmpty(permissionSql)) {
    // 拼接权限sql   
    sql += " and %s".formatted(permissionSql);
}
```

## 测试
看到这里，我们可以看出来，数据权限的实现其实就是动态权限sql生成的实现

为了加深理解掌握，我们测试做几个例子看一下：在不同数据权限下，权限公用方法生成了什么sql

创建一个测试数据权限：
<el-image style="width: 100%;" :src="previewSrcList[4]" :preview-src-list="previewSrcList" fit="cover" :initial-index="4" alt="" />

并分配给当前角色测试数据权限：
<el-image style="width: 100%;" :src="previewSrcList[5]" :preview-src-list="previewSrcList" fit="cover" :initial-index="5" alt="" />

编写如下单元测试代码：
```java
@Slf4j
@SpringBootTest
public class CommonServiceTest {
    @Resource
    private CommonService commonService;
    @Resource
    private SysLoginService sysLoginService;

    @Test
    public void testGetPermissionSql() {
        SaTokenContextMockUtil.setMockContext(() -> {
            MockHttpServletRequest mockHttpServletRequest = new MockHttpServletRequest();
            // 先模拟登录
            JSONObject params = new JSONObject();
            params.put("username", "admin");
            params.put("password", "admin123");
            params.put("isDemo", "1");
            sysLoginService.login(mockHttpServletRequest, params);

            String permissionSql = commonService.getPermissionSql("sys_log", "create_by", "sys_role_id", "sys_org_id");
            log.error("权限sql: {}", permissionSql);
        });
    }
}

```
输出如下：
```shell
权限sql: (create_by = 1 and sys_role_id <> 1 and ( sys_org_id = 1 or create_by in (2,3) ))
```

再去 `数据权限` 菜单调整数据权限表达式变成如下：
<el-image style="width: 100%;" :src="previewSrcList[6]" :preview-src-list="previewSrcList" fit="cover" :initial-index="6" alt="" />

再次执行测试用例，输出如下：
```shell
权限sql: (sys_role_id = 1 or create_by <> 1 or sys_org_id <> 1)
```

测试用例代码位于： system/service/src/test/java/com/xh/system/CommonServiceTest.java，
可自行运行测试，加深理解

## 代码生成
为了进一步降低数据权限对于开发人员的心智负担，`代码生成器` 支持一键生成带数据权限的查询功能，自动创建数据实体，拼接数据权限sql，这样咱们就有更多的时间来学习（摸鱼）了。
<el-image style="width: 100%;" :src="previewSrcList[7]" :preview-src-list="previewSrcList" fit="cover" :initial-index="7" alt="" />
