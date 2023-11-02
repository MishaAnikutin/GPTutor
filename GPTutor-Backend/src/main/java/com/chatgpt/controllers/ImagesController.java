package com.chatgpt.controllers;

import com.chatgpt.entity.GenerateImageRequest;
import com.chatgpt.entity.Image;
import com.chatgpt.services.ImagesService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
public class ImagesController {
    @Autowired
    ImagesService imagesService;

    @PostMapping(path = "/image")
//    @RateLimiter(name = "imagesLimitCreate", fallbackMethod = "fallbackMethodGenerateImage")
    List<Image> generateImage(@RequestBody GenerateImageRequest prompt, HttpServletRequest request) {
        return imagesService.generateImage((String) request.getAttribute("vkUserId"), prompt);
    }


    @GetMapping(path = "/image")
    @RateLimiter(name = "historyLimit", fallbackMethod = "fallbackMethodGetImages")
    Page<Image> getImages(HttpServletRequest request,
                          @RequestParam(defaultValue = "0") int pageNumber,
                          @RequestParam(defaultValue = "10") int pageSize) {

        return imagesService.getImages((String) request.getAttribute("vkUserId"),
                pageNumber,
                pageSize
        );
    }

    public Page<Image> fallbackMethodGetImages(HttpServletRequest request, int pageNumber, int pageSize, Exception e) {
        throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many requests");
    }

    public List<Image> fallbackMethodGenerateImage(@RequestBody GenerateImageRequest prompt, HttpServletRequest request, Exception e) {
        throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many requests");
    }
}
