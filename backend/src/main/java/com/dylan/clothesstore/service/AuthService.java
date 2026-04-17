package com.dylan.clothesstore.service;

import com.dylan.clothesstore.dto.AuthResponseDto;
import com.dylan.clothesstore.dto.LoginRequestDto;
import com.dylan.clothesstore.dto.RegisterRequestDto;
import com.dylan.clothesstore.model.Role;
import com.dylan.clothesstore.model.User;
import com.dylan.clothesstore.repository.RoleRepository;
import com.dylan.clothesstore.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponseDto register(RegisterRequestDto request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        Role customerRole = roleRepository.findByName("CUSTOMER")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName("CUSTOMER");
                    return roleRepository.save(role);
                });

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(customerRole);

        User savedUser = userRepository.save(user);
        return mapToAuthResponse(savedUser);
    }

    public AuthResponseDto login(LoginRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        return mapToAuthResponse(user);
    }

    private AuthResponseDto mapToAuthResponse(User user) {
        AuthResponseDto response = new AuthResponseDto();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole() != null ? user.getRole().getName() : null);
        return response;
    }
}