package com.simple.cms.config;

import com.simple.cms.model.User;
import com.simple.cms.repo.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminSeeder {
    @Bean
    CommandLineRunner seedAdmin(UserRepository userRepository,
                                PasswordEncoder passwordEncoder,
                                @Value("${app.admin.username}") String adminUsername,
                                @Value("${app.admin.password}") String adminPassword) {
        return args -> {
            if (!userRepository.findByUsername(adminUsername).isPresent()) {
                User u = new User();
                u.setUsername(adminUsername);
                u.setPasswordHash(passwordEncoder.encode(adminPassword));
                u.setRole("ADMIN");
                userRepository.save(u);
            }
        };
    }
}
