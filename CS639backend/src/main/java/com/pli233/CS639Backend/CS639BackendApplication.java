// This is the main class that serves as the entry point for the Spring Boot application.
package com.pli233.CS639Backend;

//import related package and classes
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// This annotation indicates that the class is a Spring Boot application.
@SpringBootApplication
// This annotation tells MyBatis to look for mappers in the specified package.
@MapperScan("com.pli233.CS639Backend.mapper")

// The main method is the entry point for the application.
public class CS639BackendApplication {
    // The SpringApplication.run method starts the Spring Boot application.
    public static void main(String[] args) {
        SpringApplication.run(CS639BackendApplication.class, args);
    }
}
