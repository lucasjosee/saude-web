package com.saude;

import com.saude.controller.ProfissionalSaudeController;
import com.saude.model.Categoria;
import com.saude.model.ProfissionalSaude;
import com.saude.repository.ProfissionalSaudeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProfissionalSaudeController.class)
class ProfissionalSaudeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProfissionalSaudeRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void deveInserirProfissionalComSucesso() throws Exception {
        ProfissionalSaude prof = new ProfissionalSaude();
        prof.setId(1L);
        prof.setNome("Dr. João Silva");
        prof.setTelefone("31999999999");
        prof.setCategoria(Categoria.MEDICO);

        when(repository.save(any(ProfissionalSaude.class))).thenReturn(prof);

        mockMvc.perform(post("/api/profissionais")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(prof)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Dr. João Silva"))
                .andExpect(jsonPath("$.categoria").value("MEDICO"));
    }

    @Test
    void deveListarProfissionaisVazio() throws Exception {
        when(repository.findAllByOrderByNomeAsc()).thenReturn(Arrays.asList());

        mockMvc.perform(get("/api/profissionais"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void deveRetornar404ParaProfissionalInexistente() throws Exception {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/profissionais/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveExcluirProfissionalComSucesso() throws Exception {
        ProfissionalSaude prof = new ProfissionalSaude();
        prof.setId(1L);
        prof.setNome("Dra. Maria Lima");
        prof.setCategoria(Categoria.PSICOLOGO);

        when(repository.findById(1L)).thenReturn(Optional.of(prof));

        mockMvc.perform(delete("/api/profissionais/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mensagem").value("Profissional removido com sucesso"));
    }

    @Test
    void deveBuscarPorCategoria() throws Exception {
        ProfissionalSaude prof = new ProfissionalSaude();
        prof.setId(1L);
        prof.setNome("Dr. Carlos");
        prof.setCategoria(Categoria.FISIOTERAPEUTA);

        when(repository.findByCategoria(Categoria.FISIOTERAPEUTA)).thenReturn(Arrays.asList(prof));

        mockMvc.perform(get("/api/profissionais/categoria/FISIOTERAPEUTA"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Dr. Carlos"));
    }
}
