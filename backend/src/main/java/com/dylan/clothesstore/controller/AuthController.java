package com.dylan.clothesstore.controller;

import com.dylan.clothesstore.dto.AuthResponseDto;
import com.dylan.clothesstore.dto.LoginRequestDto;
import com.dylan.clothesstore.dto.RegisterRequestDto;
import com.dylan.clothesstore.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponseDto register(@RequestBody RegisterRequestDto request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponseDto login(@RequestBody LoginRequestDto request) {
        return authService.login(request);
    }
}