package com.example.driveclone.controllers;

import com.example.driveclone.utils.fileStorage.service.FilesStorageService;
import com.example.driveclone.utils.jwt.JwtUtil;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.text.ParseException;
import java.util.*;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@RestController
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class FileController {

    public String retrieveUser(@NotNull HttpServletRequest request) throws ParseException, JOSEException {
        String authorizationHeader = request.getHeader(AUTHORIZATION);
        String token;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring("Bearer ".length());
            UsernamePasswordAuthenticationToken authenticationToken = JwtUtil.parseToken(token);
            return (String) authenticationToken.getPrincipal();

        }
        return null;
    }

    private static final Logger logger =
            LoggerFactory.getLogger(FileController.class);
    @Autowired
    FilesStorageService storageService;

    @PostMapping(value = "/files", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)

    public Map<String, List<String>> uploadFiles(@RequestParam("file") MultipartFile[] files, HttpServletRequest httpServletRequest) throws ParseException, JOSEException {
        String username = retrieveUser(httpServletRequest);
        List<String> fileNames = new ArrayList<>();
        Map<String, List<String>> response = new HashMap<>();
        Arrays.stream(files).forEach(file -> {
            try {
                storageService.save(file, username);
            } catch (IOException e) {
                e.printStackTrace();
            }

            fileNames.add(file.getOriginalFilename());
        });
        response.put("Uploaded the files successfully: ", fileNames);
        return response;
    }

    @PostMapping(value = "/file", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    public Map<String, String> uploadFile(@RequestParam("file") MultipartFile file, HttpServletRequest httpServletRequest) throws IOException, ParseException, JOSEException {
        String username = retrieveUser(httpServletRequest);
        return storageService.save(file, username);
    }


    @GetMapping(value = "/files", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, ?> getListFiles(@RequestParam String limit,
                                       @RequestParam String pageNumber,
                                       @RequestParam(required = false) String orderBy,
                                       HttpServletRequest httpServletRequest) throws IOException, ParseException, JOSEException {
        logger.debug("limit: " + limit);
        logger.debug("pageNumber: " + pageNumber);
        int offset = (Integer.parseInt(pageNumber) - 1) * Integer.parseInt(limit);
        String username = retrieveUser(httpServletRequest);
        return storageService.loadAll(username, Integer.parseInt(limit), offset);
    }

    @GetMapping(value = "/file/{filename:.+}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public Resource getFile(@PathVariable String filename,
                            HttpServletRequest httpServletRequest,
                            HttpServletResponse httpServletResponse) throws MalformedURLException, ParseException, JOSEException {
        String username = retrieveUser(httpServletRequest);
        Resource file = storageService.load(filename, username);
        httpServletResponse.addHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getFilename());
        httpServletResponse.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
        return file;
    }

    @DeleteMapping(value = "/file/{filename:.+}", produces = MediaType.APPLICATION_JSON_VALUE)
    public boolean deleteFile(@PathVariable String filename, HttpServletRequest httpServletRequest) throws IOException, ParseException, JOSEException {
        String username = retrieveUser(httpServletRequest);
        return storageService.deleteOne(filename, username);
    }


    @PatchMapping(value = "/file/{oldName:.+}/{newName:.+}", produces = MediaType.APPLICATION_JSON_VALUE)
    public boolean renameFile(@PathVariable String oldName, @PathVariable String newName, HttpServletRequest httpServletRequest) throws IOException, ParseException, JOSEException {
        String username = retrieveUser(httpServletRequest);
        return storageService.renameOne(oldName, newName, username);
    }
}