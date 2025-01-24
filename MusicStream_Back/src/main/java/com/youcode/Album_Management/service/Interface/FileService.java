package com.youcode.Album_Management.service.Interface;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


public interface FileService {
    String storeFileInGridFS(MultipartFile file) throws IOException;
    byte[] getFile(String id) throws IOException;
}