package com.simple.cms.controller;

import com.simple.cms.model.Post;
import com.simple.cms.repo.PostRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostRepository postRepository;
    public PostController(PostRepository postRepository) { this.postRepository = postRepository; }

    @GetMapping
    public List<Post> list() { 
        return postRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")); 
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> get(@PathVariable Long id) {
        Optional<Post> p = postRepository.findById(id);
        return p.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Post create(@RequestBody Post post) {
        post.setId(null);
        return postRepository.save(post);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!postRepository.existsById(id)) return ResponseEntity.notFound().build();
        postRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
