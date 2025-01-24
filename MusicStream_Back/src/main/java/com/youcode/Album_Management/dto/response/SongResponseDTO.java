package com.youcode.Album_Management.dto.response;

import lombok.Data;

@Data
public class SongResponseDTO {
    private String id;


    private String title;


    private Integer duree;


    private Integer trackNumber;

    private String albumId;
}
