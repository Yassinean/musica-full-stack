package com.youcode.Album_Management.service.Interface;

import com.youcode.Album_Management.dto.request.SongRequestDTO;
import com.youcode.Album_Management.dto.response.SongResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface SongService {
    Page<SongResponseDTO> getAllSongs(Pageable pageable);
    Page<SongResponseDTO> searchSongsByTitle(String title, Pageable pageable);
    Page<SongResponseDTO> getSongsByAlbumId(String albumId, Pageable pageable);
    SongResponseDTO createSong(SongRequestDTO chansonDTO ,  MultipartFile audioFile);
    SongResponseDTO updateSong(String id, SongRequestDTO songDTO, MultipartFile audioFile);
    void deleteSong(String id);
    SongResponseDTO getSongById(String id);
    Page<SongResponseDTO> searchSongsByTitleInAlbum(String albumId, String songTitle, Pageable pageable);
}
