package com.youcode.Album_Management.service.Interface;

import com.youcode.Album_Management.dto.request.UserRequestDTO;
import com.youcode.Album_Management.dto.response.UserResponseDTO;
import com.youcode.Album_Management.entity.User;

import java.util.List;

public interface UserService {
    UserResponseDTO register(UserRequestDTO userDTO);
    List<UserResponseDTO> getAllUsers();
    void updateUserRoles(String id, List<String> roles);
    User loadUserByUsername(String username);
}
