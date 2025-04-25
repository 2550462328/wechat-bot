package com.iflytek.yys;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * 核心启动器
 */
@SpringBootApplication
@EnableAsync
public class YysPaasServerTemplateApplication {

    public static void main(String[] args) {
        SpringApplication.run(YysPaasServerTemplateApplication.class, args);
    }
}
