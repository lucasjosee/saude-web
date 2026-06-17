package com.saude;

import com.saude.controller.AtendimentoController;
import com.saude.model.Atendimento;
import com.saude.model.Categoria;
import com.saude.model.ProfissionalSaude;
import com.saude.repository.AtendimentoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AtendimentoController.class)
class AtendimentoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AtendimentoRepository repository;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void deveCriarAtendimentoComSucesso() throws Exception {
        Atendimento at = new Atendimento();
        at.setId(1L);
        at.setData(LocalDate.of(2024, 12, 20));
        at.setHorario(LocalTime.of(10, 0));
        at.setProblemaTex("Dor nas costas");

        when(repository.save(any(Atendimento.class))).thenReturn(at);

        mockMvc.perform(post("/api/atendimentos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(at)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.problemaTex").value("Dor nas costas"));
    }

    @Test
    void deveListarAtendimentosOrdenados() throws Exception {
        Atendimento at1 = new Atendimento();
        at1.setId(1L);
        at1.setData(LocalDate.of(2024, 12, 15));

        Atendimento at2 = new Atendimento();
        at2.setId(2L);
        at2.setData(LocalDate.of(2024, 12, 16));

        when(repository.findAllByOrderByDataAscHorarioAsc()).thenReturn(Arrays.asList(at1, at2));

        mockMvc.perform(get("/api/atendimentos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    void deveRetornar404ParaAtendimentoInexistente() throws Exception {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/atendimentos/999"))
                .andExpect(status().isNotFound());
    }
}
