package com.youcode.Album_Management;

import  com.youcode.Album_Management.controller.AuthController;
import  com.youcode.Album_Management.dto.response.AuthResponse;
import  com.youcode.Album_Management.dto.request.LoginRequest;
import  com.youcode.Album_Management.dto.request.UserRequestDTO;
import com.youcode.Album_Management.dto.response.UserResponseDTO;
import  com.youcode.Album_Management.security.JwtTokenProvider;
import  com.youcode.Album_Management.service.CustomUserDetails;
import  com.youcode.Album_Management.service.Interface.UserService;
import com.youcode.Album_Management.service.TokenBlacklistService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthControllerSecurityTest {

    private AuthController authController;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private TokenBlacklistService tokenBlacklistService;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UserService userService;

    @Mock
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        authController = new AuthController(authenticationManager, jwtTokenProvider, userService , tokenBlacklistService);
    }

    @Test
    void login_ShouldReturnTokenOnValidCredentials() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("user1");
        request.setPassword("password");

        var authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
        CustomUserDetails userDetails = new CustomUserDetails("user1", "password", true, authorities);

        List<String> roleNames = authorities.stream()
                .map(SimpleGrantedAuthority::getAuthority)
                .collect(Collectors.toList()); // Convert authorities to List<String>

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtTokenProvider.generateToken(userDetails.getUsername(), roleNames)).thenReturn("mocked-token"); // Pass List<String>

        // Act
        ResponseEntity<AuthResponse> response = authController.login(request);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("mocked-token", Objects.requireNonNull(response.getBody()).getToken());
        assertEquals("user1", response.getBody().getUsername());
        assertEquals(roleNames, response.getBody().getRoles());
    }


    @Test
    void login_ShouldThrowExceptionOnInvalidCredentials() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("user1");
        request.setPassword("wrong-password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Invalid credentials"));

        // Act & Assert
        try {
            authController.login(request);
        } catch (RuntimeException e) {
            assertEquals("Invalid credentials", e.getMessage());
        }
    }

    @Test
    void register_ShouldReturnTokenOnSuccessfulRegistration() {
        // Arrange
        var authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));


        UserRequestDTO userDTO = new UserRequestDTO();
        userDTO.setUsername("newuser");
        userDTO.setPassword("password");
        userDTO.setRoles(Collections.singletonList("ROLE_USER"));

        UserResponseDTO registeredUser = new UserResponseDTO();
        registeredUser.setUsername("newuser");
        registeredUser.setPassword("password");
        registeredUser.setRoles(Collections.singletonList("ROLE_USER"));

        List<String> roleNames = authorities.stream()
                .map(SimpleGrantedAuthority::getAuthority)
                .toList();

        when(userService.register(userDTO)).thenReturn(registeredUser);
        when(jwtTokenProvider.generateToken(registeredUser.getUsername(), roleNames)).thenReturn("mocked-token");

        // Act
        ResponseEntity<AuthResponse> response = authController.register(userDTO);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("mocked-token", Objects.requireNonNull(response.getBody()).getToken());
        assertEquals("newuser", response.getBody().getUsername());
        assertEquals(authorities, response.getBody().getRoles());
    }

    @Test
    void register_ShouldThrowExceptionOnInvalidData() {
        // Arrange
        UserRequestDTO userDTO = new UserRequestDTO();
        userDTO.setUsername("");
        userDTO.setPassword("password");
        userDTO.setRoles(Collections.singletonList("ROLE_USER"));

        when(userService.register(userDTO)).thenThrow(new RuntimeException("Invalid user data"));

        // Act & Assert
        try {
            authController.register(userDTO);
        } catch (RuntimeException e) {
            assertEquals("Invalid user data", e.getMessage());
        }
    }
}
