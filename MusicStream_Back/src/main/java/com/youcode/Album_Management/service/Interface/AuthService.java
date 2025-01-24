package com.youcode.Album_Management.service.Interface;

import com.youcode.Album_Management.dto.request.UserRequestDTO;
import com.youcode.Album_Management.dto.response.UserResponseDTO;

public interface AuthService {
    UserResponseDTO login(UserRequestDTO Authrequest);
    UserResponseDTO register(UserRequestDTO Authrequest);
}
