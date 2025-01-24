package com.youcode.Album_Management.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AlbumRequestDTO {
    private String id;

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must not exceed 100 characters")
    private String title;

    @NotBlank(message = "Artist is required")
    @Size(max = 100, message = "Artist name must not exceed 100 characters")
    private String artist;

    @NotNull(message = "Year is required")
    @Positive(message = "Year must be a positive number")
    private Integer year;
}
