package com.youcode.Album_Management.service.Implementation;

import com.youcode.Album_Management.dto.TitleAlbumUpdateDto;
import com.youcode.Album_Management.dto.request.AlbumRequestDTO;
import com.youcode.Album_Management.dto.response.AlbumResponseDTO;
import com.youcode.Album_Management.entity.Album;
import com.youcode.Album_Management.mapper.AlbumMapper;
import com.youcode.Album_Management.repository.AlbumRepository;
import com.youcode.Album_Management.service.Interface.AlbumService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AlbumServiceImpl implements AlbumService {


    private final AlbumRepository albumRepository;
    private final AlbumMapper albumMapper;

    @Override
    public Page<AlbumResponseDTO> getAllAlbums(Pageable pageable) {
        return albumRepository.findAll(pageable).map(albumMapper::toDTO);
    }

    @Override
    public Page<AlbumResponseDTO> searchAlbumsByTitle(String title, Pageable pageable) {
        return albumRepository.findByTitleContaining(title, pageable).map(albumMapper::toDTO);
    }

    @Override
    public Page<AlbumResponseDTO> searchAlbumsByArtist(String artist, Pageable pageable) {
        return albumRepository.findByArtist(artist, pageable).map(albumMapper::toDTO);
    }

    @Override
    public Page<AlbumResponseDTO> filterAlbumsByYear(Integer year, Pageable pageable) {
        return albumRepository.findByYear(year, pageable).map(albumMapper::toDTO);
    }

    @Override
    public AlbumResponseDTO createAlbum(AlbumRequestDTO albumDTO) {
        Album album = albumMapper.toEntity(albumDTO);
        return albumMapper.toDTO(albumRepository.save(album));
    }

    @Override
    public AlbumResponseDTO updateAlbum(String id, AlbumRequestDTO albumDTO) {
        Album album = albumMapper.toEntity(albumDTO);
        album.setId(id);
        return albumMapper.toDTO(albumRepository.save(album));
    }

    @Override
    public void deleteAlbum(String id) {
        albumRepository.deleteById(id);
    }


    public List<AlbumResponseDTO> updateTitleAlbum(String id , TitleAlbumUpdateDto titleAlbumUpdateDto) {
        Album album = albumRepository.findById(id).get();

        album.setTitle(titleAlbumUpdateDto.getTitle());

        albumRepository.save(album);


        return albumRepository.findAll()
                .stream()
                .map(albumMapper::toDTO)
                .sorted(Comparator.comparing(AlbumResponseDTO::getTitle))
                .collect(Collectors.toList());
    }

    @Override
    public AlbumResponseDTO getAlbumById(String id) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Album not found with id: " + id)); // You can replace RuntimeException with a custom exception.
        return albumMapper.toDTO(album);
    }
}
