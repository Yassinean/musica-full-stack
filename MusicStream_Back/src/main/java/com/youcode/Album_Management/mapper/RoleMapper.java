package com.youcode.Album_Management.mapper;

import com.youcode.Album_Management.dto.RoleDTO;
import com.youcode.Album_Management.entity.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleDTO toDTO(Role role);

    Role toEntity(RoleDTO roleDTO);
}
