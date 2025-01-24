package com.youcode.Album_Management.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;

@Configuration
public class GridFSConfig {
    private final MongoDatabaseFactory dbFactory;
    private final MongoConverter converter;
    private final MongoClient mongoClient;

    public GridFSConfig(MongoDatabaseFactory dbFactory, MongoConverter converter, MongoClient mongoClient) {
        this.dbFactory = dbFactory;
        this.converter = converter;
        this.mongoClient = mongoClient;
    }

    @Bean
    public GridFSBucket gridFSBucket() {
        return GridFSBuckets.create(mongoClient.getDatabase("musicadb"));
    }

    @Bean
    public GridFsTemplate gridFsTemplate() {
        return new GridFsTemplate(dbFactory, converter);
    }
}
