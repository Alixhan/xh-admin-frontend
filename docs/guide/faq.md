# 常见问题
此处记录一些使用上的常见问题，如果大家也踩坑了，可以提交PR，记录下常见踩坑，在此处展示，互帮互助，把时间还在刀刃上，提高工作效率，这样就有更多的时间摸鱼了。

##  Nacos部署选择数据源mysql8.0，启动报错No DataSource Set
选择mysql5.7正常，但是选择mysql8.0就报这个错，配置都确认无问题，但就是用不了mysql8.0
排查了好久，发现是数据库字符集的问题.
试试创建nacos库的时候，配置数据库的字符集和排序规则
已创建的修改一下也行

```sql
SET NAMES utf8mb4;
CREATE database if NOT EXISTS `nacos_config` default character set utf8mb4 collate utf8mb4_unicode_ci;
```
