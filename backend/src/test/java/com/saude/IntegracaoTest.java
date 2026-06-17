package com.saude;

import com.saude.model.Categoria;
import com.saude.model.ProfissionalSaude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class IntegracaoTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void deveExecutarFluxoCompletoProfissional() throws Exception {
        ProfissionalSaude prof = new ProfissionalSaude();
        prof.setNome("Dra. Ana Costa");
        prof.setTelefone("31988887777");
        prof.setCategoria(Categoria.MEDICO);

        MvcResult result = mockMvc.perform(post("/api/profissionais")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(prof)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Dra. Ana Costa"))
                .andReturn();

        Long id = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("id").asLong();

        mockMvc.perform(get("/api/profissionais/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categoria").value("MEDICO"));

        prof.setNome("Dra. Ana Costa Silva");
        mockMvc.perform(put("/api/profissionais/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(prof)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Dra. Ana Costa Silva"));

        mockMvc.perform(delete("/api/profissionais/" + id))
                .andExpect(status().isOk());
    }

    @Test
    void deveVincularAtendimentoAProfissional() throws Exception {
        ProfissionalSaude prof = new ProfissionalSaude();
        prof.setNome("Dr. Pedro Alves");
        prof.setCategoria(Categoria.FISIOTERAPEUTA);

        MvcResult profResult = mockMvc.perform(post("/api/profissionais")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(prof)))
                .andExpect(status().isCreated())
                .andReturn();

        Long profId = objectMapper.readTree(
                profResult.getResponse().getContentAsString()).get("id").asLong();

        String atJson = String.format("""
            {
                "data": "2024-12-20",
                "horario": "14:00",
                "problemaTex": "Tensão muscular",
                "receitaSaude": "Atividade física de alongamento",
                "profissional": {"id": %d}
            }
            """, profId);

        mockMvc.perform(post("/api/atendimentos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(atJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.problemaTex").value("Tensão muscular"));
    }
}
