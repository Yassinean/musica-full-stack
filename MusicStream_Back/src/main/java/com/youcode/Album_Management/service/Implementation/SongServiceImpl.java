package com.youcode.Album_Management.service.Implementation;

import com.youcode.Album_Management.dto.request.SongRequestDTO;
import com.youcode.Album_Management.dto.response.SongResponseDTO;
import com.youcode.Album_Management.entity.Album;
import com.youcode.Album_Management.entity.Song;
import com.youcode.Album_Management.mapper.SongMapper;
import com.youcode.Album_Management.repository.AlbumRepository;
import com.youcode.Album_Management.repository.SongRepository;
import com.youcode.Album_Management.service.Interface.SongService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class SongServiceImpl implements SongService {

    private SongRepository songRepository;


    private AlbumRepository albumRepository;

    private SongMapper songMapper;

    @Override
    public Page<SongResponseDTO> getAllSongs(Pageable pageable) {
        return songRepository.findAll(pageable).map(songMapper::toDTO);
    }

    @Override
    public Page<SongResponseDTO> searchSongsByTitle(String title, Pageable pageable) {
        return songRepository.findByTitleContaining(title, pageable).map(songMapper::toDTO);
    }

    @Override
    public Page<SongResponseDTO> getSongsByAlbumId(String albumId, Pageable pageable) {
        return songRepository.findByAlbumId(albumId, pageable).map(songMapper::toDTO);
    }

    @Override
    public SongResponseDTO createSong(SongRequestDTO songDTO) {
        Album album = albumRepository.findById(songDTO.getAlbumId())
                .orElseThrow(() -> new IllegalArgumentException("Album not found"));
        Song song = songMapper.toEntity(songDTO);
        song.setAlbum(album);
        return songMapper.toDTO(songRepository.save(song));
    }

    @Override
    public SongResponseDTO updateSong(String id, SongRequestDTO songDTO) {
        Album album = albumRepository.findById(songDTO.getAlbumId())
                .orElseThrow(() -> new IllegalArgumentException("Album not found"));
        Song song = songMapper.toEntity(songDTO);
        song.setAlbum(album);
        song.setId(id);
        return songMapper.toDTO(songRepository.save(song));
    }

    @Override
    public void deleteSong(String id) {
       songRepository.deleteById(id);
    }
}
