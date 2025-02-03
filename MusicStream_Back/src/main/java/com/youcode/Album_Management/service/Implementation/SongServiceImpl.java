package com.youcode.Album_Management.service.Implementation;

import com.youcode.Album_Management.dto.request.SongRequestDTO;
import com.youcode.Album_Management.dto.response.SongResponseDTO;
import com.youcode.Album_Management.entity.Album;
import com.youcode.Album_Management.entity.Song;
import com.youcode.Album_Management.mapper.SongMapper;
import com.youcode.Album_Management.repository.AlbumRepository;
import com.youcode.Album_Management.repository.SongRepository;
import com.youcode.Album_Management.service.GridFsService;
import com.youcode.Album_Management.service.Interface.SongService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class SongServiceImpl implements SongService {

    private SongRepository songRepository;
    private AlbumRepository albumRepository;
    private SongMapper songMapper;

    private final GridFsService gridFsService;

    private static final long MAX_FILE_SIZE_MB = 15 * 1024 * 1024; // 15 MB
    private static final String[] SUPPORTED_FILE_TYPES = {"audio/mpeg", "audio/wav", "audio/ogg"};

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
    public SongResponseDTO createSong(SongRequestDTO songDTO, MultipartFile audioFile) {
        if (audioFile == null || audioFile.isEmpty()) {
            throw new IllegalArgumentException("Audio file is required");
        }

        String audioFileId = gridFsService.saveFile(audioFile);
        Album album = albumRepository.findById(songDTO.getAlbumId())
                .orElseThrow(() -> new IllegalArgumentException("Album not found"));

        Song song = songMapper.toEntity(songDTO);
        song.setAlbum(album);
        song.setAudioFileId(audioFileId);
        song.setAddedAt(LocalDate.from(LocalDateTime.now()));

        return songMapper.toDTO(songRepository.save(song));
    }

    @Override
    public SongResponseDTO updateSong(String id, SongRequestDTO songDTO, MultipartFile audioFile) {
        Album album = albumRepository.findById(songDTO.getAlbumId())
                .orElseThrow(() -> new IllegalArgumentException("Album not found"));

        Song song = songRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Song not found"));

        song.setTitle(songDTO.getTitle());
        song.setDuree(songDTO.getDuree());
        song.setTrackNumber(songDTO.getTrackNumber());
        song.setDescription(songDTO.getDescription());
        song.setCategory(songDTO.getCategory());
        song.setAlbum(album);
        song.setAddedAt(LocalDate.from(LocalDateTime.now()));

        if (audioFile != null && !audioFile.isEmpty()) {
            validateAudioFile(audioFile);
            String audioFileId = gridFsService.saveFile(audioFile);
            song.setAudioFileId(audioFileId);
        }

        return songMapper.toDTO(songRepository.save(song));
    }

    @Override
    public void deleteSong(String id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Song not found"));

        if (song.getAudioFileId() != null) {
            gridFsService.deleteFile(song.getAudioFileId());
        }

        songRepository.deleteById(id);
    }

    private void validateAudioFile(MultipartFile audioFile) {
        if (audioFile.getSize() > MAX_FILE_SIZE_MB) {
            throw new IllegalArgumentException("File size exceeds the 15MB limit");
        }

        String fileType = audioFile.getContentType();
        if (fileType == null || !isSupportedFileType(fileType)) {
            throw new IllegalArgumentException("Unsupported file type. Allowed types: MP3, WAV, OGG");
        }
    }

    private boolean isSupportedFileType(String fileType) {
        for (String supportedType : SUPPORTED_FILE_TYPES) {
            if (supportedType.equals(fileType)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public SongResponseDTO getSongById(String id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Song not found"));

        return songMapper.toDTO(song);
    }

    @Override
    public Page<SongResponseDTO> searchSongsByTitleInAlbum(String albumId, String songTitle, Pageable pageable) {
        return songRepository.findByAlbumIdAndTitleContainingIgnoreCase(albumId, songTitle, pageable)
                .map(songMapper::toDTO);
    }
}
