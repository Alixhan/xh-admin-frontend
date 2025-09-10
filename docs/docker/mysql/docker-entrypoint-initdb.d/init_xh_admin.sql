
/*
# XHAN-ADMIN
# Copyright (c) 2023-present, sunxiaohan.
# Date: 17/05/2024 22:31:53
*/


CREATE database if NOT EXISTS `xh_admin` default character set utf8mb4 collate utf8mb4_0900_ai_ci;
use `xh_admin`;


SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_dict_detail
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_detail`;
CREATE TABLE `sys_dict_detail`  (
                                    `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
                                    `sys_dict_type_id` int NULL DEFAULT NULL COMMENT '字典类型ID',
                                    `parent_id` int NULL DEFAULT NULL COMMENT '上级id',
                                    `value` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '字典值key',
                                    `label` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '字典名称',
                                    `order` int NULL DEFAULT NULL COMMENT '排序号',
                                    `enabled` bit(1) NULL DEFAULT NULL COMMENT '是否启用1：是，0：否',
                                    `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
                                    `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
                                    `create_by` int NULL DEFAULT NULL COMMENT '创建人',
                                    `update_by` int NULL DEFAULT NULL COMMENT '修改人',
                                    `deleted` bit(1) NULL DEFAULT 0 COMMENT '是否已删除1：是，0：否',
                                    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '数据字典明细表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_dict_detail
-- ----------------------------
INSERT INTO `sys_dict_detail` VALUES (1, 1, NULL, '1', '是', 1, 1, '2023-06-01 16:17:22', '2024-12-12 23:10:00', NULL, 1, 0);
INSERT INTO `sys_dict_detail` VALUES (2, 1, NULL, '0', '否', 2, 1, '2023-06-01 16:17:50', NULL, NULL, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (3, 2, NULL, 'INT', 'INT', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (4, 2, NULL, 'DATETIME', 'DATETIME', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (5, 2, NULL, 'TINYINT', 'TINYINT', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (6, 2, NULL, 'VARCHAR', 'VARCHAR', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (7, 2, NULL, 'TEXT', 'TEXT', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (8, 2, NULL, 'DOUBLE', 'DOUBLE', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (9, 2, NULL, 'MEDIUMTEXT', 'MEDIUMTEXT', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (10, 2, NULL, 'LONGTEXT', 'LONGTEXT', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (11, 2, NULL, 'BIGINT', 'BIGINT', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (12, 2, NULL, 'BIT', 'BIT', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (13, 2, NULL, 'ENUM', 'ENUM', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (14, 2, NULL, 'JSON', 'JSON', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (15, 2, NULL, 'TIMESTAMP', 'TIMESTAMP', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (16, 2, NULL, 'SET', 'SET', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (17, 2, NULL, 'BINARY', 'BINARY', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (18, 2, NULL, 'CHAR', 'CHAR', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (19, 2, NULL, 'FLOAT', 'FLOAT', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (20, 2, NULL, 'VARBINARY', 'VARBINARY', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (21, 2, NULL, 'DECIMAL', 'DECIMAL', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (22, 2, NULL, 'BLOB', 'BLOB', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (23, 2, NULL, 'MEDIUMBLOB', 'MEDIUMBLOB', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (24, 2, NULL, 'SMALLINT', 'SMALLINT', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (25, 2, NULL, 'TIME', 'TIME', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (26, 2, NULL, 'LONGBLOB', 'LONGBLOB', NULL, 1, '2024-09-12 23:50:29', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (27, 3, NULL, 'String', 'String', NULL, 1, '2024-09-12 23:52:37', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (28, 3, NULL, 'Integer', 'Integer', NULL, 1, '2024-09-12 23:52:37', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (29, 3, NULL, 'Long', 'Long', NULL, 1, '2024-09-12 23:52:37', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (30, 3, NULL, 'Double', 'Double', NULL, 1, '2024-09-12 23:52:37', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (31, 3, NULL, 'BigDecimal', 'BigDecimal', NULL, 1, '2024-09-12 23:52:37', NULL, 1, NULL, 1);
INSERT INTO `sys_dict_detail` VALUES (32, 3, NULL, 'LocalDateTime', 'LocalDateTime', NULL, 1, '2024-09-12 23:52:37', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (33, 3, NULL, 'LocalDate', 'LocalDate', NULL, 1, '2024-09-12 23:52:37', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (34, 3, NULL, 'LocalTime', 'LocalTime', NULL, 1, '2024-09-12 23:52:37', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (35, 3, NULL, 'Boolean', 'Boolean', NULL, 1, '2024-11-09 12:07:50', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (36, 2, NULL, 'DATE', 'DATE', NULL, 1, '2024-11-09 16:34:09', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_detail` VALUES (37, 3, NULL, 'BigDecimal', 'BigDecimal', NULL, 1, '2024-11-20 18:13:33', NULL, 1, NULL, 0);

-- ----------------------------
-- Table structure for sys_dict_type
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_type`;
CREATE TABLE `sys_dict_type`  (
                                  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
                                  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '字典类型名称',
                                  `modifiable` tinyint NULL DEFAULT NULL COMMENT '是否可修改，1：是，0：否',
                                  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
                                  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
                                  `create_by` int NULL DEFAULT NULL COMMENT '创建人',
                                  `update_by` int NULL DEFAULT NULL COMMENT '修改人',
                                  `deleted` bit(1) NULL DEFAULT 0 COMMENT '是否已删除1：是，0：否',
                                  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '数据字典类型表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_dict_type
-- ----------------------------
INSERT INTO `sys_dict_type` VALUES (1, '是否', 1, '2023-06-01 16:15:15', '2023-06-01 16:15:17', 1, 1, 0);
INSERT INTO `sys_dict_type` VALUES (2, 'mysql字段类型', 1, '2024-09-12 23:35:55', NULL, 1, NULL, 0);
INSERT INTO `sys_dict_type` VALUES (3, 'java类型', 1, '2023-05-26 12:57:44', '2023-05-26 12:57:47', 1, 1, 0);

-- ----------------------------
-- Table structure for sys_file
-- ----------------------------
DROP TABLE IF EXISTS `sys_file`;
create table sys_file
(
    id                    int auto_increment comment 'id'
        primary key,
    object                varchar(100)      null comment '对象存储key',
    name                  varchar(50)       null comment '文件名',
    content_type          varchar(100)      null comment '文件类型',
    suffix                varchar(50)       null comment '文件后缀扩展名',
    size                  mediumtext        null comment '文件大小',
    preview_image_file_id int               null comment '视频抽帧预览图，上传时会尝试抽第10帧图片作为视频文件的预览图',
    img_width             int               null comment '图片宽度',
    img_height            int               null comment '图片高度',
    img_ratio             double(5, 2)      null comment '图片宽高比',
    status                tinyint           null comment '文件状态，1：正常，2:：禁用，3：标记删除，4：已删除',
    sha1                  varchar(50)       null comment '文件摘要sha1',
    sys_org_id            int               null comment '机构ID',
    sys_role_id           int               null comment '角色ID',
    create_time           datetime          null comment '创建时间',
    update_time           datetime          null comment '更新时间',
    create_by             int               null comment '创建人',
    update_by             int               null comment '修改人',
    deleted               tinyint default 0 null comment '是否已删除1：是，0：否'
)
    comment '系统文件表' row_format = DYNAMIC;
-- ----------------------------
-- Records of sys_file
-- ----------------------------

-- ----------------------------
-- Table structure for sys_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_log`;
CREATE TABLE `sys_log`  (
                            `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
                            `token` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'token',
                            `method` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '请求方法',
                            `url` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '请求路径',
                            `content_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '请求内容类型',
                            `request_parameter` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '请求参数',
                            `request_body` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '请求体',
                            `response_body` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '响应体',
                            `ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'ip地址',
                            `ip_address` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'ip属地',
                            `tag` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '模块',
                            `operation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '操作',
                            `start_time` datetime NULL DEFAULT NULL COMMENT '开始时间',
                            `end_time` datetime NULL DEFAULT NULL COMMENT '结束时间',
                            `time` bigint NULL DEFAULT NULL COMMENT '耗时ms',
                            `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '响应状态',
                            `stack_trace` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '异常堆栈信息',
                            `locale` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '使用语言',
                            `locale_label` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '使用语言名称',
                            `sys_org_id` bigint NULL DEFAULT NULL COMMENT '使用机构ID',
                            `org_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '使用机构名称',
                            `sys_role_id` bigint NULL DEFAULT NULL COMMENT '使用角色ID',
                            `role_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '使用角色名称',
                            `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
                            `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
                            `create_by` int NULL DEFAULT NULL COMMENT '创建人',
                            `update_by` int NULL DEFAULT NULL COMMENT '修改人',
                            `deleted` bit(1) NOT NULL DEFAULT 0 COMMENT '是否已删除1：是，0：否',
                            PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '系统日志' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu`  (
                             `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
                             `parent_id` int NULL DEFAULT NULL COMMENT '上级id',
                             `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '菜单标题',
                             `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '路由名称',
                             `path` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '路由路径',
                             `component` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '组件全路径',
                             `platform` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '平台(web,app)',
                             `type` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '菜单类型(dir：目录，menu：菜单，btn：按钮)',
                             `handle_type` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '处理类型(route：路由，frame：frame，outer：外链)',
                             `outer_url` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '外链地址',
                             `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '菜单图标',
                             `icon_type` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图标类型(el,ali,svg,)',
                             `order` int NULL DEFAULT NULL COMMENT '排序号',
                             `cache` bit(1) NULL DEFAULT NULL COMMENT '是否缓存1：是，0：否',
                             `enabled` bit(1) NULL DEFAULT NULL COMMENT '是否启用1：是，0：否',
                             `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
                             `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
                             `create_by` int NULL DEFAULT NULL COMMENT '创建人',
                             `update_by` int NULL DEFAULT NULL COMMENT '修改人',
                             `deleted` tinyint NULL DEFAULT 0 COMMENT '是否已删除1：是，0：否',
                             PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 76 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '系统菜单' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO `sys_menu` VALUES (1, NULL, '首页', 'home', 'home', '/src/views/home/index.vue', 'web', 'menu', 'route', NULL, 'el|HomeFilled', 'el', 1, 1, 1, '2023-03-05 21:55:27', '2024-05-04 18:05:00', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (2, NULL, '系统管理', 'system', 'system', NULL, 'web', 'dir', NULL, NULL, 'el|Tools', 'el', 2, 1, 1, '2023-03-05 21:55:27', '2024-05-05 19:20:37', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (3, 2, '菜单管理', 'system:menu', 'menu', '/src/views/system/menu/index.vue', 'web', 'menu', 'route', NULL, 'el|Menu', 'el', 1, 1, 1, '2023-03-05 21:55:27', '2024-05-04 18:05:06', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (4, 2, '用户管理', 'system:user', 'user', '/src/views/system/user/index.vue', 'web', 'menu', 'route', NULL, 'el|UserFilled', 'el', 2, 1, 1, '2023-03-05 21:55:27', '2024-05-08 12:56:24', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (6, 11, '百度跳转', 'baidu', NULL, NULL, 'web', 'menu', 'outer', 'https://www.baidu.com', 'el|UserFilled', 'el', 5, 1, 1, '2023-03-05 21:55:27', '2023-05-19 22:23:24', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (7, 11, '内嵌iframe', 'iframe', 'iframe', '/src/views/iframe/index.vue', 'web', 'menu', 'iframe', 'https://cn.bing.com', 'el|Link', 'svg', 5, 1, 1, '2023-03-05 21:55:27', '2023-06-30 23:58:09', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (11, NULL, '测试目录', 'test', 'test', NULL, 'web', 'dir', NULL, NULL, 'el|FolderOpened', 'el', 8, 1, 1, '2023-03-05 21:55:27', '2023-08-15 14:39:24', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (12, 11, '测试二级目录', 'testdir2', 'testdir2', NULL, 'web', 'dir', NULL, NULL, 'el|Tools', 'el', 1, 1, 1, '2023-03-28 23:44:12', '2023-03-31 22:00:59', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (14, 12, '测试三级目录', 'dir3', 'dir3', NULL, 'web', 'dir', NULL, NULL, 'el|Lollipop', NULL, 2, 1, 1, '2023-03-31 12:13:05', NULL, NULL, NULL, 0);
INSERT INTO `sys_menu` VALUES (15, 14, '三级目录子菜单', 'menu3', 'menu3', '/src/views/home/index.vue', 'web', 'menu', 'route', NULL, 'el|MagicStick', NULL, 1, 1, 1, '2023-03-31 12:22:35', '2024-05-14 15:24:25', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (16, 3, '新增', 'system:menu:add', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 12:59:28', '2023-08-14 15:30:18', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (17, 3, '编辑', 'system:menu:edit', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 12:59:44', '2023-08-14 15:30:10', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (18, 3, '明细', 'system:menu:detail', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 13:01:08', '2023-08-14 15:30:02', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (19, 4, '新增', 'system:user:add', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:57:26', '2023-08-14 15:31:08', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (20, 4, '编辑', 'system:user:edit', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:57:51', '2023-08-14 15:31:00', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (21, 4, '明细', 'system:user:detail', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:58:09', '2023-08-14 15:30:52', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (22, 4, '删除', 'system:user:del', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:58:45', '2023-08-14 15:30:47', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (23, 2, '文件管理', 'system:file', 'file', '/src/views/system/file/index.vue', 'web', 'menu', 'route', NULL, 'local|/src/assets/icon/file.svg', 'el', 4, 1, 1, '2023-03-05 21:55:27', '2023-08-14 15:29:25', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (24, 23, '编辑', 'system:file:edit', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:57:51', '2024-05-04 18:04:55', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (25, 23, '明细', 'system:file:detail', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:58:09', '2023-08-14 15:35:11', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (26, 23, '删除', 'system:file:del', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:58:45', '2023-08-14 15:35:06', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (27, 2, '角色管理', 'system:role', 'role', '/src/views/system/role/index.vue', 'web', 'menu', 'route', NULL, 'el|Stamp', NULL, 3, 1, 1, '2023-03-05 21:55:27', '2023-08-14 15:29:08', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (28, 2, '机构管理', 'system:org', 'org', '/src/views/system/org/index.vue', 'web', 'menu', 'route', NULL, 'local|/src/assets/icon/organization.svg', NULL, 3, 1, 1, '2023-03-05 21:55:27', '2023-08-14 15:29:02', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (29, 2, '数据字典', 'system:dict', 'dict', '/src/views/system/dict/index.vue', 'web', 'menu', 'route', NULL, 'local|/src/assets/icon/dictionary.svg', NULL, 5, 1, 1, '2023-03-05 21:55:27', '2023-08-16 14:24:33', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (30, 29, '新增', 'system:dict:add', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:57:26', '2023-08-14 15:32:47', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (31, 29, '编辑', 'system:dict:edit', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:57:51', '2023-08-14 15:32:53', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (32, 29, '明细', 'system:dict:detail', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:58:09', '2023-08-14 15:33:00', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (33, 29, '删除', 'system:dict:del', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:58:45', '2023-08-14 15:33:07', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (34, 3, '删除', 'system:menu:del', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:58:45', '2023-08-14 15:29:47', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (35, 28, '新增', 'system:org:add', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:57:26', '2023-08-14 15:33:31', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (36, 28, '编辑', 'system:org:edit', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:57:51', '2023-08-14 15:33:37', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (37, 28, '删除', 'system:org:del', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:58:45', '2023-08-14 15:33:43', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (38, 27, '新增', 'system:role:add', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:57:26', '2023-08-14 15:34:12', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (39, 27, '编辑', 'system:role:edit', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:57:51', '2023-08-14 15:34:25', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (40, 27, '明细', 'system:role:detail', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:58:09', '2024-01-23 14:03:28', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (41, 27, '删除', 'system:role:del', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:58:45', '2023-08-14 15:34:35', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (42, 4, '角色维护', 'system:user:role', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:58:09', '2023-08-14 15:30:41', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (43, 2, '用户组管理', 'system:userGroup', 'userGroup', '/src/views/system/user/userGroupIndex.vue', 'web', 'menu', 'route', NULL, 'local|/src/assets/icon/user-group.svg', NULL, 3, 1, 1, '2023-03-05 21:55:27', '2024-05-15 15:56:01', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (44, 43, '新增', 'system:userGroup:add', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:57:26', '2023-08-14 15:32:00', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (45, 43, '编辑', 'system:userGroup:edit', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:57:51', '2023-08-15 14:44:13', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (46, 43, '删除', 'system:userGroup:del', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:58:45', '2023-08-14 15:32:13', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (48, 43, '明细', 'system:userGroup:detail', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:58:09', '2023-08-14 15:32:28', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (49, 4, '导入', 'system:user:import', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:58:09', '2023-08-14 15:30:41', NULL, 1, 0);
INSERT INTO `sys_menu` VALUES (50, NULL, '系统监控', 'monitor', 'monitor', NULL, 'web', 'dir', NULL, NULL, 'el|Monitor', NULL, 3, 1, 1, '2023-08-17 21:36:25', NULL, 1, NULL, 0);
INSERT INTO `sys_menu` VALUES (51, 50, '在线用户', 'monitor:online', 'onlien', '/src/views/monitor/online/index.vue', 'web', 'menu', 'route', NULL, 'local|/src/assets/icon/online-user.svg', NULL, NULL, 1, 1, '2023-08-17 21:41:09', '2023-08-20 19:20:29', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (73, 50, '系统日志', 'system:log', 'log', '/src/views/system/log/index.vue', 'web', 'menu', 'route', NULL, 'el|DataLine', NULL, NULL, 1, 1, '2023-08-17 21:41:09', '2024-05-07 21:43:56', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (74, 73, '明细', 'system:log:detail', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 13:01:08', '2023-08-14 15:30:02', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (75, 73, '删除', 'system:log:del', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:58:45', '2023-08-14 15:29:47', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (77, 2, '数据权限', 'system:dataPermission', 'dataPermission', '/src/views/system/dataPermission/index.vue', 'web', 'menu', 'route', NULL, 'el|Key', NULL, 6, 1, 1, '2023-03-05 21:55:27', '2024-08-17 18:07:58', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (78, 77, '明细', 'system:dataPermission:detail', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:58:09', '2024-08-17 19:31:41', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (79, 77, '新增', 'system:dataPermission:add', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:57:26', '2023-08-14 15:32:47', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (80, 77, '编辑', 'system:dataPermission:edit', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:57:51', '2023-08-14 15:32:53', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (81, 77, '删除', 'system:dataPermission:del', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:58:45', '2023-08-14 15:33:07', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (82, 27, '数据权限', 'system:role:dataPermission', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, 5, 1, 1, '2023-04-03 23:58:09', '2024-08-18 23:11:59', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (83, NULL, '代码生成', 'generator', 'generator', '/src/views/generator/index.vue', 'web', 'menu', 'route', NULL, 'local|/src/assets/icon/generator.svg', NULL, 9, 1, 1, '2023-03-05 21:55:27', '2024-11-12 20:51:21', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (84, 83, '新增', 'generator:add', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 12:59:28', '2023-08-14 15:30:18', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (85, 83, '编辑', 'generator:edit', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 12:59:44', '2023-08-14 15:30:10', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (86, 83, '明细', 'generator:detail', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 13:01:08', '2023-08-14 15:30:02', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (87, 83, '删除', 'generator:del', NULL, NULL, 'web', 'btn', NULL, NULL, NULL, NULL, NULL, 1, 1, '2023-04-03 23:58:45', '2023-08-14 15:29:47', 1, 1, 0);

-- ----------------------------
-- Table structure for sys_org
-- ----------------------------
DROP TABLE IF EXISTS `sys_org`;
CREATE TABLE `sys_org`  (
                            `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
                            `parent_id` int NULL DEFAULT NULL COMMENT '上级id',
                            `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '机构代码',
                            `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '机构名称',
                            `enabled` bit(1) NULL DEFAULT NULL COMMENT '是否启用1：是，0：否',
                            `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
                            `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
                            `create_by` int NULL DEFAULT NULL COMMENT '创建人',
                            `update_by` int NULL DEFAULT NULL COMMENT '修改人',
                            `deleted` bit(1) NOT NULL DEFAULT 0 COMMENT '是否已删除1：是，0：否',
                            PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '系统机构表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_org
-- ----------------------------
INSERT INTO `sys_org` VALUES (1, NULL, 'ZB', '总部', 1, '2023-06-06 22:26:55', '2023-08-15 14:40:04', 1, 1, 0);
INSERT INTO `sys_org` VALUES (2, 1, 'JG01', '机构1', 1, '2023-06-06 23:57:32', '2023-06-06 23:57:34', 1, 1, 0);
INSERT INTO `sys_org` VALUES (3, 1, 'JG02', '机构2', 1, '2023-06-06 23:57:32', '2023-06-06 23:57:34', 1, 1, 0);
INSERT INTO `sys_org` VALUES (4, 1, 'JG03', '机构3', 1, '2023-06-06 23:57:32', '2023-06-06 23:57:34', 1, 1, 0);
INSERT INTO `sys_org` VALUES (5, 1, 'JG04', '机构4', 1, '2023-06-06 23:57:32', '2023-06-06 23:57:34', 1, 1, 0);
INSERT INTO `sys_org` VALUES (6, 1, 'JG05', '机构5', 1, '2023-06-06 23:57:32', '2023-06-06 23:57:34', 1, 1, 0);
INSERT INTO `sys_org` VALUES (7, 2, 'JG001-01', '机构1子机构1', 1, '2023-06-15 17:42:29', '2023-06-15 17:43:30', NULL, 1, 0);
INSERT INTO `sys_org` VALUES (8, 2, 'JG001-02', '机构1子机构2', 1, '2023-06-15 17:43:02', '2023-06-15 17:46:04', NULL, 1, 1);

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
                             `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
                             `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '角色名称',
                             `parent_id` int NULL DEFAULT NULL COMMENT '上级id',
                             `enabled` bit(1) NULL DEFAULT NULL COMMENT '是否启用1：是，0：否',
                             `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
                             `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
                             `create_by` int NULL DEFAULT NULL COMMENT '创建人',
                             `update_by` int NULL DEFAULT NULL COMMENT '修改人',
                             `deleted` bit(1) NOT NULL DEFAULT 0 COMMENT '是否已删除1：是，0：否',
                             PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '系统角色表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES (1, '系统管理员', NULL, 1, '2023-06-17 02:04:17', '2024-05-14 15:24:09', NULL, 1, 0);
INSERT INTO `sys_role` VALUES (7, '人员管理', 1, 1, '2024-03-18 02:29:55', '2024-03-18 02:33:25', 1, 1, 0);

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu`  (
                                  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
                                  `sys_role_id` int NULL DEFAULT NULL COMMENT '角色id',
                                  `sys_menu_id` int NULL DEFAULT NULL COMMENT '菜单id',
                                  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
                                  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
                                  `create_by` int NULL DEFAULT NULL COMMENT '创建人',
                                  `update_by` int NULL DEFAULT NULL COMMENT '修改人',
                                  `deleted` bit(1) NOT NULL DEFAULT 0 COMMENT '是否已删除1：是，0：否',
                                  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1190 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '系统角色权限表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
INSERT INTO `sys_role_menu` VALUES (1068, 7, 2, '2024-03-18 02:33:25', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1069, 7, 43, '2024-03-18 02:33:25', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1070, 7, 44, '2024-03-18 02:33:25', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1071, 7, 45, '2024-03-18 02:33:25', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1072, 7, 46, '2024-03-18 02:33:25', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1073, 7, 48, '2024-03-18 02:33:25', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1074, 7, 4, '2024-03-18 02:33:25', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1075, 7, 49, '2024-03-18 02:33:25', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1076, 7, 22, '2024-03-18 02:33:25', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1077, 7, 42, '2024-03-18 02:33:25', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1078, 7, 21, '2024-03-18 02:33:25', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1079, 7, 20, '2024-03-18 02:33:25', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1080, 7, 19, '2024-03-18 02:33:25', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1081, 7, 50, '2024-03-18 02:33:25', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1082, 7, 51, '2024-03-18 02:33:25', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1142, 1, 1, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1143, 1, 2, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1144, 1, 3, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1145, 1, 34, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1146, 1, 16, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1147, 1, 17, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1148, 1, 18, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1149, 1, 4, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1150, 1, 42, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1151, 1, 49, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1152, 1, 19, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1153, 1, 22, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1154, 1, 21, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1155, 1, 20, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1156, 1, 43, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1157, 1, 44, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1158, 1, 45, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1159, 1, 46, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1160, 1, 48, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1161, 1, 27, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1162, 1, 41, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1163, 1, 38, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1164, 1, 39, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1165, 1, 40, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1166, 1, 28, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1167, 1, 35, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1168, 1, 36, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1169, 1, 37, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1170, 1, 23, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1171, 1, 26, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1172, 1, 25, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1173, 1, 24, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1174, 1, 29, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1175, 1, 31, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1176, 1, 32, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1177, 1, 33, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1178, 1, 30, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1179, 1, 50, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1180, 1, 51, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1181, 1, 73, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1182, 1, 74, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1183, 1, 75, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1184, 1, 11, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1185, 1, 12, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1186, 1, 14, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1187, 1, 15, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1188, 1, 7, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1189, 1, 6, '2024-05-14 15:24:09', NULL, 1, NULL, 0);
INSERT INTO `sys_role_menu` VALUES (1491, 1, 83, '2025-09-10 17:56:17', NULL, 1, NULL, b'0');
INSERT INTO `sys_role_menu` VALUES (1492, 1, 85, '2025-09-10 17:56:17', NULL, 1, NULL, b'0');
INSERT INTO `sys_role_menu` VALUES (1493, 1, 86, '2025-09-10 17:56:17', NULL, 1, NULL, b'0');
INSERT INTO `sys_role_menu` VALUES (1494, 1, 87, '2025-09-10 17:56:17', NULL, 1, NULL, b'0');
INSERT INTO `sys_role_menu` VALUES (1495, 1, 84, '2025-09-10 17:56:17', NULL, 1, NULL, b'0');

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
                             `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
                             `code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户代码（登录账号）',
                             `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户名',
                             `password` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '登录密码',
                             `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像',
                             `telephone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号',
                             `status` bit(1) NULL DEFAULT NULL COMMENT '状态（1：正常，2：锁定）',
                             `failures_num` int NULL DEFAULT NULL COMMENT '登录失败的次数',
                             `lock_msg` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '账号锁定的原因',
                             `enabled` bit(1) NULL DEFAULT NULL COMMENT '是否启用1：启用，0：禁用',
                             `allow_repeat` bit(1) NULL DEFAULT NULL COMMENT '允许重复登录1：允许，0：不允许',
                             `auto_renewal` bit(1) NULL DEFAULT NULL COMMENT '自动续签，请求会自动延长token失效时间1：自动，0：不自动',
                             `is_demo` bit(1) NULL DEFAULT NULL COMMENT '是否演示账号1：是，0：否',
                             `role_sorter` varchar(500) NULL DEFAULT NULL COMMENT '角色排序',
                             `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
                             `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
                             `create_by` int NULL DEFAULT NULL COMMENT '创建人',
                             `update_by` int NULL DEFAULT NULL COMMENT '修改人',
                             `deleted` tinyint NULL DEFAULT 0 COMMENT '是否已删除1：是，0：否',
                             PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '系统用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, 'admin', '超级管理员', '$2a$10$gCTe1KKFwO5v7OYUvyVKqevvOSDuVzzBV39cYGHB41BehvoKNNcEm', '20231207/2b2efd0f7de6470f9259ac2ab6e4202f.gif', '18888888888', 1, 0, NULL, 1, 1, 1, NULL, NULL, '2023-02-26 20:19:50', '2024-05-17 19:23:05', NULL, 1, 0);

-- ----------------------------
-- Table structure for sys_user_group
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_group`;
CREATE TABLE `sys_user_group`  (
                                   `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
                                   `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户组名',
                                   `enabled` bit(1) NULL DEFAULT NULL COMMENT '是否启用1：是，0：否',
                                   `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
                                   `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
                                   `create_by` int NULL DEFAULT NULL COMMENT '创建人',
                                   `update_by` int NULL DEFAULT NULL COMMENT '修改人',
                                   `deleted` bit(1) NOT NULL DEFAULT 0 COMMENT '是否已删除1：是，0：否',
                                   PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '系统用户组表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_group
-- ----------------------------
INSERT INTO `sys_user_group` VALUES (1, '超级管理员组', 1, '2023-08-11 15:33:58', '2024-05-16 23:03:20', NULL, 1, 0);

-- ----------------------------
-- Table structure for sys_user_group_member
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_group_member`;
CREATE TABLE `sys_user_group_member`  (
                                          `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
                                          `sys_user_group_id` int NULL DEFAULT NULL COMMENT '系统用户组id',
                                          `sys_user_id` int NULL DEFAULT NULL COMMENT '系统用户id',
                                          `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
                                          `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
                                          `create_by` int NULL DEFAULT NULL COMMENT '创建人',
                                          `update_by` int NULL DEFAULT NULL COMMENT '修改人',
                                          `deleted` bit(1) NOT NULL DEFAULT 0 COMMENT '是否已删除1：是，0：否',
                                          PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '系统用户组成员表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_group_member
-- ----------------------------
INSERT INTO `sys_user_group_member` VALUES (1, 1, 1, '2023-08-11 17:43:38', NULL, 1, NULL, 0);

-- ----------------------------
-- Table structure for sys_user_job
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_job`;
CREATE TABLE `sys_user_job`  (
                                 `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
                                 `type` bit(2) NULL DEFAULT NULL COMMENT '1：用户，2：用户组',
                                 `user_id` int NULL DEFAULT NULL COMMENT '用户id或者用户组的id',
                                 `sys_org_id` int NULL DEFAULT NULL COMMENT '机构id',
                                 `sys_role_id` int NULL DEFAULT NULL COMMENT '角色id',
                                 `enabled` bit(1) NULL DEFAULT NULL COMMENT '是否启用1：是，0：否',
                                 `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
                                 `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
                                 `create_by` int NULL DEFAULT NULL COMMENT '创建人',
                                 `update_by` int NULL DEFAULT NULL COMMENT '修改人',
                                 `deleted` bit(1) NOT NULL DEFAULT 0 COMMENT '是否已删除1：是，0：否',
                                 PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户岗位表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_job
-- ----------------------------
INSERT INTO `sys_user_job` VALUES (3, 1, 1, 1, 1, 1, '2023-08-10 17:49:36', NULL, NULL, NULL, 0);
INSERT INTO `sys_user_job` VALUES (6, 2, 1, 1, 1, 1, '2023-08-11 15:33:58', NULL, 1, NULL, 0);
INSERT INTO `sys_user_job` VALUES (9, 2, 2, 5, 3, 1, '2023-08-11 22:28:02', NULL, NULL, NULL, 0);
INSERT INTO `sys_user_job` VALUES (11, 1, 43, 5, 2, 1, '2024-01-23 16:41:14', NULL, NULL, NULL, 0);
INSERT INTO `sys_user_job` VALUES (13, 2, 3, 1, 6, 1, '2024-03-17 10:46:26', NULL, NULL, NULL, 0);
INSERT INTO `sys_user_job` VALUES (14, 1, 142, 1, 7, 1, '2024-03-18 02:30:28', NULL, 1, NULL, 0);
INSERT INTO `sys_user_job` VALUES (15, 2, 1, 2, 7, 1, '2024-05-14 21:51:51', NULL, 1, NULL, 0);

-- ----------------------------
-- Table structure for sys_user_password_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_password_log`;
CREATE TABLE `sys_user_password_log`  (
                                          `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
                                          `sys_user_id` int NULL DEFAULT NULL COMMENT '系统用户id',
                                          `old_password` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '原密码',
                                          `new_password` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '新密码',
                                          `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
                                          `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
                                          `create_by` int NULL DEFAULT NULL COMMENT '创建人',
                                          `update_by` int NULL DEFAULT NULL COMMENT '修改人',
                                          `deleted` bit(1) NOT NULL DEFAULT 0 COMMENT '是否已删除1：是，0：否',
                                          PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '系统用户密码修改日志' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_password_log
-- ----------------------------

DROP TABLE IF EXISTS `sys_data_entity`;
create table sys_data_entity
(
    id   varchar(50) not null comment 'id'
        primary key,
    name varchar(50) null comment '数据实体名称'
)
    comment '数据实体';
INSERT INTO `sys_data_entity` (`id`, `name`) VALUES ('sys_log', '系统日志');
INSERT INTO `sys_data_entity` (`id`, `name`) VALUES ('sys_file', '文件管理');


DROP TABLE IF EXISTS `sys_data_permission`;
create table sys_data_permission
(
    id          int auto_increment comment 'id'
        primary key,
    name        varchar(50)          null comment '数据权限名称',
    expression  varchar(500)         null comment '权限表达式',
    json        text                 null comment '权限json数据',
    create_time datetime             null comment '创建时间',
    update_time datetime             null comment '更新时间',
    create_by   int                  null comment '创建人',
    update_by   int                  null comment '修改人',
    deleted     bit(1) default 0 null comment '是否已删除1：是，0：否'
)
    comment '数据权限';

INSERT INTO `sys_data_permission` (`id`, `name`, `expression`, `json`, `create_time`, `update_time`, `create_by`, `update_by`, `deleted`) VALUES (1, '仅可查看本人数据', '$BR', '[{\"prop\":\"$BR\",\"logic\":\"and\",\"condition\":\"positive\"}]', '2024-08-17 20:07:17', '2024-08-21 21:44:25', 1, 1, 0);
INSERT INTO `sys_data_permission` (`id`, `name`, `expression`, `json`, `create_time`, `update_time`, `create_by`, `update_by`, `deleted`) VALUES (2, '仅可见本机构数据', '$BJG', '[{\"prop\":\"$BJG\",\"logic\":\"and\",\"condition\":\"positive\",\"value\":\"\"}]', '2024-08-18 22:59:19', '2024-08-21 21:44:35', 1, 1, 0);
INSERT INTO `sys_data_permission` (`id`, `name`, `expression`, `json`, `create_time`, `update_time`, `create_by`, `update_by`, `deleted`) VALUES (3, '仅可见当前角色数据', '$DQJS', '[{\"prop\":\"$DQJS\",\"logic\":\"and\",\"condition\":\"positive\",\"value\":\"\"}]', '2024-08-18 23:00:00', '2024-08-21 21:44:49', 1, 1, 0);
INSERT INTO `sys_data_permission` (`id`, `name`, `expression`, `json`, `create_time`, `update_time`, `create_by`, `update_by`, `deleted`) VALUES (4, '可查看本机构及下属机构数据', '$BJG or $BJGX', '[{\"prop\":\"$BJG\",\"logic\":\"and\",\"condition\":\"positive\",\"value\":\"\"},{\"prop\":\"$BJGX\",\"logic\":\"or\",\"condition\":\"positive\"}]', '2024-08-18 23:00:52', '2024-08-22 00:30:13', 1, 1, 0);
INSERT INTO `sys_data_permission` (`id`, `name`, `expression`, `json`, `create_time`, `update_time`, `create_by`, `update_by`, `deleted`) VALUES (5, '可查看当前角色及下属角色的数据', '$DQJS or $DQJSX', '[{\"prop\":\"$DQJS\",\"logic\":\"and\",\"condition\":\"positive\"},{\"prop\":\"$DQJSX\",\"logic\":\"or\",\"condition\":\"positive\"}]', '2024-08-18 23:01:45', '2024-08-22 00:30:26', 1, 1, 0);
INSERT INTO `sys_data_permission` (`id`, `name`, `expression`, `json`, `create_time`, `update_time`, `create_by`, `update_by`, `deleted`) VALUES (6, '可查看所有', '', '[]', '2025-05-28 15:26:58', '2025-09-10 18:25:17', 1, 1, b'0');

DROP TABLE IF EXISTS `sys_role_data_permission`;
create table sys_role_data_permission
(
    id                     int auto_increment comment 'id'
        primary key,
    sys_role_id            bigint               null comment '角色ID',
    sys_data_entity_id     varchar(20)          null comment '数据实体ID',
    sys_data_permission_id bigint               null comment '数据权限ID',
    create_time            datetime             null comment '创建时间',
    update_time            datetime             null comment '更新时间',
    create_by              int                  null comment '创建人',
    update_by              int                  null comment '修改人',
    deleted                bit(1) default 0 null comment '是否已删除1：是，0：否'
)
    comment '系统角色数据权限';

DROP TABLE IF EXISTS `gen_table`;
create table gen_table
(
    id            int auto_increment comment 'id'
        primary key,
    design_type   varchar(1)           null comment '设计方式',
    table_name    varchar(20)          null comment '表名',
    table_comment varchar(20)          null comment '表注释',
    entity_name   varchar(20)          null comment '实体类名',
    name          varchar(20)          null comment '功能名',
    service       varchar(20)          null comment '所属服务',
    module        varchar(20)          null comment '模块名',
    author        varchar(20)          null comment '作者',
    extend        varchar(20)          null comment '继承类',
    columns_json  longtext             null comment '列json串',
    frontend_path varchar(200)         null comment '前端项目生成路径',
    backend_path  varchar(200)         null comment '后端项目生成路径',
    is_create_menu bit(1) DEFAULT NULL COMMENT '是否创建系统菜单',
    is_data_permission bit(1) DEFAULT NULL COMMENT '是否启用数据权限',
    create_time   datetime             null comment '创建时间',
    update_time   datetime             null comment '更新时间',
    create_by     int                  null comment '创建人',
    update_by     int                  null comment '修改人',
    deleted       bit(1) default 0 null comment '是否已删除1：是，0：否'
)
    comment '代码生成表';

SET FOREIGN_KEY_CHECKS = 1;
