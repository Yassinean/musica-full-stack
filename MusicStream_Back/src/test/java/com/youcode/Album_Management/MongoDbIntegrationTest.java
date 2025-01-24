package com.youcode.Album_Management;

import com.youcode.Album_Management.entity.Album;
import com.youcode.Album_Management.repository.AlbumRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Slf4j
public class MongoDbIntegrationTest {

    @Autowired
    private AlbumRepository albumRepository;

    @Test
    void testMongoDbConnection() {
        Album album = new Album();
        album.setTitle("Test Album");
        album.setArtist("Test Artist");
        album.setYear(2024);
        log.info("before saving in db");
        albumRepository.save(album);
        assert !albumRepository.findAll().isEmpty();
    }
}
