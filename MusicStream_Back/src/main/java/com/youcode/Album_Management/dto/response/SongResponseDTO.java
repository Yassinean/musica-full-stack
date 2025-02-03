package com.youcode.Album_Management.dto.response;

import com.youcode.Album_Management.entity.enums.MusicCategory;
import lombok.Data;

@Data
public class SongResponseDTO {
    private String id;


    private String title;


    private Integer duree;

    private MusicCategory category;

    private Integer trackNumber;

    private String albumId;

    private String audioFileId;
}
