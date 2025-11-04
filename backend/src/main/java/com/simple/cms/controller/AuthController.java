package com.simple.cms.controller;

import com.simple.cms.repo.UserRepository;
import com.simple.cms.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    public static class LoginRequest {
        private String username;
        private String password;

        public LoginRequest() {}

        public LoginRequest(String username, String password) {
            this.username = username;
            this.password = password;
        }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest body, HttpServletResponse response) {
        java.util.Optional<com.simple.cms.model.User> userOpt = userRepository.findByUsername(body.getUsername());
        if (!userOpt.isPresent()) return ResponseEntity.status(401).build();
        com.simple.cms.model.User user = userOpt.get();
        if (!passwordEncoder.matches(body.getPassword(), user.getPasswordHash())) return ResponseEntity.status(401).build();
        String token = jwtService.generateToken(user.getUsername());
        
        Cookie cookie = new Cookie("authToken", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(600); // 10分
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
        
        java.util.Map<String, String> responseMap = new java.util.HashMap<>();
        responseMap.put("username", user.getUsername());
        return ResponseEntity.ok(responseMap);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Cookieクリア
        Cookie cookie = new Cookie("authToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
        
        return ResponseEntity.ok().build();
    }
}
