package com.youcode.Album_Management.service.Interface;

import com.youcode.Album_Management.dto.request.SongRequestDTO;
import com.youcode.Album_Management.dto.response.SongResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SongService {
    Page<SongResponseDTO> getAllSongs(Pageable pageable);
    Page<SongResponseDTO> searchSongsByTitle(String title, Pageable pageable);
    Page<SongResponseDTO> getSongsByAlbumId(String albumId, Pageable pageable);
    SongResponseDTO createSong(SongRequestDTO chansonDTO);
    SongResponseDTO updateSong(String id, SongRequestDTO chansonDTO);
    void deleteSong(String id);
}
