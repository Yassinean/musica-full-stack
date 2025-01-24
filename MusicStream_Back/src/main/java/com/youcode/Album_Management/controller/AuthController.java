package com.youcode.Album_Management.controller;

import com.youcode.Album_Management.dto.request.LoginRequest;
import com.youcode.Album_Management.dto.request.UserRequestDTO;
import com.youcode.Album_Management.dto.response.AuthResponse;
import com.youcode.Album_Management.dto.response.UserResponseDTO;
import com.youcode.Album_Management.security.JwtTokenProvider;
import com.youcode.Album_Management.service.CustomUserDetails;
import com.youcode.Album_Management.service.Interface.UserService;
import com.youcode.Album_Management.service.TokenBlacklistService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private TokenBlacklistService tokenBlacklistService;




    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        String token = jwtTokenProvider.generateToken(userDetails.getUsername(), roles);

        return ResponseEntity.ok(new AuthResponse(token, userDetails.getUsername(), userDetails.getAuthorities()));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody UserRequestDTO userDTO) {
        UserResponseDTO registeredUser = userService.register(userDTO);

        List<String> roles = registeredUser.getRoles();

        String token = jwtTokenProvider.generateToken(registeredUser.getUsername(), roles);

      /**  Date expirationDate = Jwts.parserBuilder()
                .setSigningKey(jwtTokenProvider.getKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
       **/

        List<SimpleGrantedAuthority> authorities = registeredUser.getRoles().stream()
                .map(SimpleGrantedAuthority::new)
                .toList();

        return ResponseEntity.ok(new AuthResponse(token, registeredUser.getUsername(), authorities));
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        tokenBlacklistService.blacklistToken(token);

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}