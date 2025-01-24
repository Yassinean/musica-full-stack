package com.youcode.Album_Management.mapper;

import com.youcode.Album_Management.dto.request.SongRequestDTO;
import com.youcode.Album_Management.dto.response.SongResponseDTO;
import com.youcode.Album_Management.entity.Song;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SongMapper {

    @Mapping(source = "album.id", target = "albumId")
    SongResponseDTO toDTO(Song song);

    @Mapping(target = "album", ignore = true)
    Song toEntity(SongRequestDTO songRequestDTO);
}
