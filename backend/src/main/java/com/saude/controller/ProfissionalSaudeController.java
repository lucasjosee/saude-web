package com.saude.controller;

import com.saude.model.Categoria;
import com.saude.model.ProfissionalSaude;
import com.saude.repository.ProfissionalSaudeRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profissionais")
@CrossOrigin(origins = "*")
public class ProfissionalSaudeController {

    private final ProfissionalSaudeRepository repository;

    public ProfissionalSaudeController(ProfissionalSaudeRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<ProfissionalSaude> inserir(@Valid @RequestBody ProfissionalSaude profissional) {
        ProfissionalSaude salvo = repository.save(profissional);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @GetMapping
    public ResponseEntity<List<ProfissionalSaude>> listar() {
        return ResponseEntity.ok(repository.findAllByOrderByNomeAsc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> consultarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ProfissionalSaude>> consultarPorNome(@RequestParam String nome) {
        return ResponseEntity.ok(repository.findByNomeContainingIgnoreCase(nome));
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<ProfissionalSaude>> consultarPorCategoria(@PathVariable Categoria categoria) {
        return ResponseEntity.ok(repository.findByCategoria(categoria));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> alterar(@PathVariable Long id, @Valid @RequestBody ProfissionalSaude dados) {
        return repository.findById(id)
                .map(prof -> {
                    prof.setNome(dados.getNome());
                    prof.setTelefone(dados.getTelefone());
                    prof.setEndereco(dados.getEndereco());
                    prof.setCategoria(dados.getCategoria());
                    return ResponseEntity.ok(repository.save(prof));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        return repository.findById(id)
                .map(prof -> {
                    repository.delete(prof);
                    return ResponseEntity.ok(Map.of("mensagem", "Profissional removido com sucesso"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
