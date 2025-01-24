package com.youcode.Album_Management.controller;

import com.youcode.Album_Management.dto.request.SongRequestDTO;
import com.youcode.Album_Management.dto.response.SongResponseDTO;
import com.youcode.Album_Management.service.Interface.SongService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class SongController {

    private final SongService songService;


    @GetMapping({"/user/songs", "/admin/songs"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<SongResponseDTO>> getAllChansons(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(songService.getAllSongs(pageable));
    }

    @GetMapping({"/user/songs/search", "/admin/songs/search"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<SongResponseDTO>> searchChansonsByTitle(
            @RequestParam String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(songService.searchSongsByTitle(title, pageable));
    }

    @GetMapping({"/user/songs/album", "/admin/songs/album"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<SongResponseDTO>> getSongsByAlbumId(
            @RequestParam String albumId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(songService.getSongsByAlbumId(albumId, pageable));
    }

    @PostMapping("/admin/songs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SongResponseDTO> createChanson(@RequestBody SongRequestDTO chansonDTO) {
        return ResponseEntity.ok(songService.createSong(chansonDTO));
    }
    @PutMapping("/admin/chansons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SongResponseDTO> updateChanson(@PathVariable String id, @RequestBody SongRequestDTO chansonDTO) {
        return ResponseEntity.ok(songService.updateSong(id, chansonDTO));
    }

    @DeleteMapping("/admin/chansons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteChanson(@PathVariable String id) {
        songService.deleteSong(id);
        return ResponseEntity.noContent().build();
    }
}
