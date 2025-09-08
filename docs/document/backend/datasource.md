# 多数据源配置

一般项目，单数据源就已经足够，但是部分复杂场景可能需要多数据源，例如：

- 需要做库读写分离的场景
- 不同业务访问不同的数据库

项目已默认配置两个数据源，注入代码在
`common/common-jdbc/src/main/java/com/xh/common/jdbc/configuration/DataSourceConfiguration.java`
，参考此代码配置可以配置任意多的数据源。

```java
package com.xh.common.jdbc.configuration;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

/**
 * 数据源配置
 */
@Configuration(proxyBeanMethods = false)
public class DataSourceConfiguration {

    /**
     * 第一数据源配置信息
     */
    @Bean("firstDataSourceProperties")
    @ConfigurationProperties("spring.datasource.first")
    public DataSourceProperties firstDataSourceProperties() {
        return new DataSourceProperties();
    }

    /**
     * 第一数据源
     */
    @Primary
    @Bean("firstDataSource")
    @ConfigurationProperties("spring.datasource.first.configuration")
    public DataSource firstDataSource(@Qualifier("firstDataSourceProperties") DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().type(HikariDataSource.class).build();
    }

    /**
     * 第一数据源JdbcTemplate
     */
    @Primary
    @Bean("firstJdbcTemplate")
    public JdbcTemplate firstJdbcTemplate(@Qualifier("firstDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    /**
     * 第二数据源配置信息
     */
    @Bean("secondDataSourceProperties")
    @ConfigurationProperties("spring.datasource.second")
    public DataSourceProperties secondDataSourceProperties() {
        return new DataSourceProperties();
    }

    /**
     * 第二数据源
     */
    @Bean("secondDataSource")
    @ConfigurationProperties("spring.datasource.second.configuration")
    public DataSource secondDataSource(@Qualifier("secondDataSourceProperties") DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().type(HikariDataSource.class).build();
    }

    /**
     * 第二数据源JdbcTemplate
     */
    @Bean("secondJdbcTemplate")
    public JdbcTemplate secondJdbcTemplate(@Qualifier("secondDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}
```

如果仅需主数据源，可删除该配置文件中的第二数据源相关配置。

:::warning 注意

因为在 `@Bean("firstJdbcTemplate")` 注入时，添加了 `@Primary`注解，所以项目使用 `@Resource` 注入是默认的 `JdbcTemplate`
都是第一数据源。

```java
// 默认为第一数据源
@Resource
protected JdbcTemplate secondJdbcTemplate;
```

如果想注入其他数据源，请为 `@Resource` 指定 `name`

```java
// 这里指定 name 注入了第二数据源
@Resource(name = "secondJdbcTemplate")
protected JdbcTemplate secondJdbcTemplate;
```

:::
