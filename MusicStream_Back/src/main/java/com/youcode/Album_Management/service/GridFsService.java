package com.youcode.Album_Management.service;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

@Service
public class GridFsService {

    @Autowired
    private GridFsOperations gridFsOperations;

    /**
     * Save a file to GridFS.
     *
     * @param file the file to save
     * @return the ID of the saved file
     */
    public String saveFile(MultipartFile file) {
        try {
            ObjectId fileId = gridFsOperations.store(file.getInputStream(), file.getOriginalFilename(), file.getContentType());
            return fileId.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file in GridFS", e);
        }
    }

    /**
     * Retrieve a file from GridFS by its ID.
     *
     * @param fileId the ID of the file
     * @return the GridFsResource containing the file
     */
    public GridFsResource getFile(String fileId) {
        GridFSFile gridFSFile = gridFsOperations.findOne(query(where("_id").is(fileId)));
        if (gridFSFile == null) {
            throw new IllegalArgumentException("File not found with ID: " + fileId);
        }
        return gridFsOperations.getResource(gridFSFile);
    }

    /**
     * Delete a file from GridFS by its ID.
     *
     * @param fileId the ID of the file to delete
     */
    public void deleteFile(String fileId) {
        gridFsOperations.delete(query(where("_id").is(fileId)));
    }
}
