package com.youcode.Album_Management.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.youcode.Album_Management.dto.request.SongRequestDTO;
import com.youcode.Album_Management.dto.response.SongResponseDTO;
import com.youcode.Album_Management.service.Interface.SongService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class SongController {

    private final SongService songService;
    private final GridFsTemplate gridFsTemplate;


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
    public ResponseEntity<SongResponseDTO> createSong(
            @RequestParam(value = "track", required = false) String songJson,
            @RequestParam("audioFile") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Audio file is required.");
        }

        String contentType = file.getContentType();
        if (!"audio/mpeg".equals(contentType) && !"audio/wav".equals(contentType)) {
            throw new IllegalArgumentException("Invalid audio file type. Only MP3 and WAV are allowed.");
        }

        log.debug("Raw track JSON: {}", songJson); // Debug raw JSON
        log.debug("Audio file: {}", file.getOriginalFilename());
        ObjectMapper objectMapper = new ObjectMapper();// Debug file name
        SongRequestDTO songRequestDTO = objectMapper.readValue(songJson, SongRequestDTO.class);
        log.debug("SongRequestDTO received: {}", songRequestDTO);
        return ResponseEntity.ok(songService.createSong(songRequestDTO, file));
    }

    @PutMapping("/admin/songs/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SongResponseDTO> updateSong(
            @PathVariable String id,
            @RequestParam("song") String songJson,
            @RequestParam(value = "audioFile" , required = false) MultipartFile file) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        SongRequestDTO songRequestDTO = objectMapper.readValue(songJson, SongRequestDTO.class);
        return ResponseEntity.ok(songService.updateSong(id, songRequestDTO, file));
    }

    @DeleteMapping("/admin/songs/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSong(@PathVariable String id) {
        songService.deleteSong(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping({"/user/songs/stream/{audioFileId}", "/admin/songs/stream/{audioFileId}"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public void streamAudio(
            @PathVariable String audioFileId,
            HttpServletRequest request,
            HttpServletResponse response) {
        try {
            ObjectId fileId = new ObjectId(audioFileId);

            GridFsResource resource = gridFsTemplate.getResource(
                    gridFsTemplate.findOne(new Query(Criteria.where("_id").is(fileId)))
            );

            if (resource == null || !resource.exists()) {
                response.setStatus(HttpStatus.NOT_FOUND.value());
                return;
            }
            long fileSize = resource.contentLength();
            String contentType = resource.getContentType();
            InputStream inputStream = resource.getInputStream();

            String rangeHeader = request.getHeader("Range");
            long start = 0;
            long end = fileSize - 1;
            if (rangeHeader != null && rangeHeader.startsWith("bytes=")) {
                String[] ranges = rangeHeader.substring(6).split("-");
                start = Long.parseLong(ranges[0]);
                if (ranges.length > 1) {
                    end = Long.parseLong(ranges[1]);
                }
            }
            long contentLength = end - start + 1;
            response.setHeader(HttpHeaders.CONTENT_TYPE, contentType);
            response.setHeader(HttpHeaders.ACCEPT_RANGES, "bytes");
            if (rangeHeader != null) {
                response.setStatus(HttpStatus.PARTIAL_CONTENT.value());
                response.setHeader(HttpHeaders.CONTENT_RANGE,
                        String.format("bytes %d-%d/%d", start, end, fileSize));
            } else {
                response.setStatus(HttpStatus.OK.value());
            }
            response.setHeader(HttpHeaders.CONTENT_LENGTH, String.valueOf(contentLength));
            response.setHeader(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000");
            if (start > 0) {
                inputStream.skip(start);
            }
            try (InputStream is = inputStream) {
                StreamUtils.copyRange(is, response.getOutputStream(), start, end);
            }

        } catch (IllegalArgumentException e) {
            log.error("Invalid audio file ID: {}", audioFileId, e);
            response.setStatus(HttpStatus.BAD_REQUEST.value());
        } catch (IOException e) {
            log.error("Error streaming audio file: {}", audioFileId, e);
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        } catch (Exception e) {
            log.error("Unexpected error while streaming audio: {}", audioFileId, e);
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    private long[] parseRangeHeader(String rangeHeader, long fileSize) {
        try {
            if (rangeHeader == null || !rangeHeader.startsWith("bytes=")) {
                return new long[]{0, fileSize - 1};
            }

            String[] ranges = rangeHeader.substring(6).split("-");
            long start = Long.parseLong(ranges[0]);
            long end = ranges.length > 1 ? Long.parseLong(ranges[1]) : fileSize - 1;

            if (start >= fileSize || end >= fileSize || start > end) {
                return new long[]{0, fileSize - 1};
            }

            return new long[]{start, end};
        } catch (NumberFormatException e) {
            return new long[]{0, fileSize - 1};
        }
    }

    @GetMapping({"/user/songs/{id}", "/admin/songs/{id}"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<SongResponseDTO> getSongById(@PathVariable String id) {
        try {
            SongResponseDTO song = songService.getSongById(id);
            return ResponseEntity.ok(song);
        } catch (IllegalArgumentException e) {
            log.error("Invalid song ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            log.error("Error retrieving song with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping({"/user/songs/album/{albumId}/search", "/admin/songs/album/{albumId}/search"})
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<SongResponseDTO>> searchSongsByTitleInAlbum(
            @PathVariable String albumId,
            @RequestParam String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(
                songService.searchSongsByTitleInAlbum(albumId, title, pageable)
        );
    }

}
