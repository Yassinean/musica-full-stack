package com.youcode.Album_Management.controller;

import com.youcode.Album_Management.dto.TitleAlbumUpdateDto;
import com.youcode.Album_Management.dto.request.AlbumRequestDTO;
import com.youcode.Album_Management.dto.response.AlbumResponseDTO;
import com.youcode.Album_Management.service.Interface.AlbumService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AlbumController {

    private final AlbumService albumService;


    @GetMapping({"/user/albums", "/admin/albums"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<AlbumResponseDTO>> getAllAlbums(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(albumService.getAllAlbums(pageable));
    }

    @GetMapping({"/user/albums/search", "/admin/albums/search"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<AlbumResponseDTO>> searchAlbumsByTitle(
            @RequestParam String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(albumService.searchAlbumsByTitle(title, pageable));
    }

    @GetMapping({"/user/albums/artist", "/admin/albums/artist"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<AlbumResponseDTO>> searchAlbumsByArtist(
            @RequestParam String artist,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(albumService.searchAlbumsByArtist(artist, pageable));
    }

    @GetMapping({"/user/albums/year", "/admin/albums/year"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<AlbumResponseDTO>> filterAlbumsByYear(
            @RequestParam Integer year,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(albumService.filterAlbumsByYear(year, pageable));
    }

    @PostMapping({"/admin/albums", "/user/albums"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AlbumResponseDTO> createAlbum(@RequestBody AlbumRequestDTO albumDTO) {
        return ResponseEntity.ok(albumService.createAlbum(albumDTO));
    }

    @PutMapping("/admin/albums/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AlbumResponseDTO> updateAlbum(@PathVariable String id, @RequestBody AlbumRequestDTO albumDTO) {
        return ResponseEntity.ok(albumService.updateAlbum(id, albumDTO));
    }

    @DeleteMapping("/admin/albums/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAlbum(@PathVariable String id) {
        albumService.deleteAlbum(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping({"/user/albums/detail_album/{id}", "/admin/albums/detail_album/{id}"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<AlbumResponseDTO> getAlbumById(@PathVariable String id) {
        AlbumResponseDTO albumResponseDTO = albumService.getAlbumById(id);
        return ResponseEntity.ok(albumResponseDTO);
    }


}
