package com.youcode.Album_Management.entity;

import com.youcode.Album_Management.entity.enums.MusicCategory;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "songs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Song {

    @Id
    private String id;

    @NotBlank
    private String title;


    @NotNull
    private Integer duree;

    private Integer trackNumber;

    private String description;

    @NotNull
    private Date addedAt;

    private MusicCategory category; // You can also use an enum for MusicCategory

    @NotBlank(message = "L'ID du fichier audio est obligatoire")
    private String audioFileId;


    private String imageUrl;

    private String imageFileId;

    @DBRef
    private Album album;
}
