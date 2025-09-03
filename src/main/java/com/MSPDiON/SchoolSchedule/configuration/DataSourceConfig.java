package com.MSPDiON.SchoolSchedule.configuration;

import javax.sql.DataSource;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("dev")
public class DataSourceConfig {

  @Bean
  public DataSource getDataSource() {
    return DataSourceBuilder.create()
        .driverClassName("org.postgresql.Driver")
        .url("jdbc:postgresql://localhost:5432/school_schedule")
        .username("postgres")
        .password("admin")
        .build();
  }
}
