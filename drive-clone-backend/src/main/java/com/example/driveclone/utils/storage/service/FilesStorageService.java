package com.example.driveclone.utils.storage.service;

import com.example.driveclone.models.FileInfo;
import com.example.driveclone.models.User;
import com.example.driveclone.repository.FileRepository;
import com.example.driveclone.utils.exception.CustomError;
import com.example.driveclone.utils.storage.util.FileUtil;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
public class FilesStorageService implements IFilesStorageService {
    public final Path root = Paths.get("src/main/resources/static");
    private final FileRepository fileRepository;

    FilesStorageService(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    @Override
    public Path getUserDir(String username) {
        return Paths.get(root + "/" + username);
    }

    public Path getUserZipDir(String username) {
        return Path.of(this.getUserDir(username) + "/compressed");
    }


    @Override
    public void init() throws IOException {
        if (!Files.exists(root)) {
            Files.createDirectory(root);
        }
    }

    @Override
    public Map<String, String> save(MultipartFile file, User user) throws IOException {
        String username = user.getUsername();
        Path userDir = this.getUserDir(username);

        if (!Files.exists(userDir)) {
            Files.createDirectory(userDir);
            Files.createDirectory(getUserZipDir(username));
        }

        Path filePath = userDir.resolve(Objects.requireNonNull(file.getOriginalFilename()));
        Map<String, String> mp = new HashMap<>();
        mp.put("file uploaded", filePath.getFileName().toString());
        if(!fileRepository.findByNameAndUser(file.getOriginalFilename(), user).isEmpty()){
            return mp;
        }
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        FileInfo fileInfo = new FileInfo(filePath.getFileName().toString(), new File(filePath.toString()).length(), user, new Date());
        fileRepository.save(fileInfo);

        return mp;
    }

    @Override
    public Resource load(String filename, User user) throws MalformedURLException {
        String username = user.getUsername();
        Path userDir = this.getUserDir(username);
        Path file = Paths.get(userDir + "/" + filename);
        Resource resource = new UrlResource(file.toUri());
        if (resource.exists() || resource.isReadable()) {
            return resource;
        } else {
            throw new CustomError("Could not load the file!");
        }
    }


    @Override
    public Map<String, Object> loadAll(final User user, final int limit, final int offset, String search, final String sortBy, final String sortMode) throws IOException {
        String sortByProperty = sortBy != null ? sortBy : "name";
        Sort.Direction sortByDirection = Arrays.stream(Sort.Direction.values()).anyMatch(s -> s != null && s.name().equals(sortMode)) ? Sort.Direction.valueOf(sortMode) : Sort.Direction.ASC;
        Map<String, Object> data = new HashMap<>();
        int pageNumber = offset / limit;
        if (search.isEmpty()) {
            search = "%";
        }


        Pageable pageable = PageRequest.of(pageNumber, limit, Sort.by(sortByDirection, sortByProperty));
        Page<FileInfo> files = fileRepository.filterAll(user, search, pageable);
        long totalFiles = files.getTotalElements();
        List<FileInfo> filesContent = files.getContent();
        data.put("total", totalFiles);
        data.put("files", filesContent);
        return data;
    }

    @Override
    public void deleteAll() {
        fileRepository.deleteAll();
        FileSystemUtils.deleteRecursively(root.toFile());
    }

    @Override
    public boolean deleteOne(Long id, User user) throws IOException {
        String username = user.getUsername();
        Path userDir = this.getUserDir(username);
        Optional<FileInfo> fileFound = fileRepository.findById(id);
        if(fileFound.isEmpty()){
            throw new CustomError("Could not delete the file!");
        }
        Path file = Paths.get(userDir + "/" + fileFound.get().getName());
        Resource resource = new UrlResource(file.toUri());
        if (resource.exists() || resource.isReadable()) {
            fileRepository.delete(fileFound.get());
            return FileSystemUtils.deleteRecursively(file);
        } else {
            throw new CustomError("Could not delete the file!");
        }
    }


    public boolean zipIt(String filename, User user) throws IOException {
        String username = user.getUsername();
        Path userDir = this.getUserDir(username);
        Path file = Paths.get(userDir + "/" + filename);
        FileUtil.zipFile(file.toString(), getUserZipDir(username) + "/" + file.getFileName().toString() + ".zip");
        return true;
    }

    @Override
    public boolean renameOne(String oldName, String newName, User user) throws IOException {
        String username = user.getUsername();
        Path userDir = this.getUserDir(username);
        Path file = Paths.get(userDir + "/" + oldName);
        Resource resource = new UrlResource(userDir.toUri());
        if (resource.exists() || resource.isReadable()) {
            List<FileInfo> fileFound = fileRepository.findByNameAndUser(oldName, user);
            if (fileFound.size() != 1) {
                throw new CustomError("Could not rename the file!");
            }
            boolean isRenamed = Files.move(file, file.resolveSibling(newName)).isAbsolute();
            FileInfo fileFoundInDb = fileFound.get(0);
            fileFoundInDb.setName(newName);
            fileFoundInDb.setUrl("/static/" + username + "/" + newName);
            fileFoundInDb.setLastModifiedDate(new Date());
            fileRepository.save(fileFoundInDb);
            return isRenamed;
        } else {
            throw new CustomError("Could not rename the file!");
        }
    }


}