package com.youcode.Album_Management.dto.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AlbumResponseDTO {
    private String id;

    private String title;

    private String artist;

    private Integer year;
}
