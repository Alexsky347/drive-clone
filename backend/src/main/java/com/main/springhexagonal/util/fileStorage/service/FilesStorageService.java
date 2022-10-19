package com.main.springhexagonal.util.fileStorage.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.stream.Stream;

@Service
public class FilesStorageService implements IFilesStorageService {
    public static final Path root = Paths.get("uploads");


    @Override
    public void init() throws IOException {
        Files.createDirectory(root);
    }

    @Override
    public Resource save(MultipartFile file, String username) throws IOException {
        Path userDir = Paths.get(root + "/" + username);
        if(!Files.exists(userDir)){
            Files.createDirectory(userDir);
        }
        Path filePath = userDir.resolve(Objects.requireNonNull(file.getOriginalFilename()));
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return this.load(file.getOriginalFilename(), userDir);
    }

    @Override
    public Resource load(String filename, Path filePath) throws MalformedURLException {
        Path file = filePath.resolve(filename);
        Resource resource = new UrlResource(file.toUri());
        if (resource.exists() || resource.isReadable()) {
            return resource;
        } else {
            throw new Error("Could not load the file!");
        }

    }

    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(root.toFile());
    }

    @Override
    public Stream<Path> loadAll() throws IOException {
        return Files.walk(this.root, 1).filter(path -> !path.equals(this.root)).map(this.root::relativize);
    }

}