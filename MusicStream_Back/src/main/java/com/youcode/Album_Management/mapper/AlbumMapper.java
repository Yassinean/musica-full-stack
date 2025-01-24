package com.youcode.Album_Management.mapper;

import com.youcode.Album_Management.dto.request.AlbumRequestDTO;
import com.youcode.Album_Management.dto.response.AlbumResponseDTO;
import com.youcode.Album_Management.entity.Album;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AlbumMapper {
    AlbumResponseDTO toDTO(Album album);
    Album toEntity(AlbumRequestDTO albumRequestDTO);
}
