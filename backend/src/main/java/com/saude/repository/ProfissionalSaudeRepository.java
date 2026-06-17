package com.saude.repository;

import com.saude.model.Categoria;
import com.saude.model.ProfissionalSaude;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProfissionalSaudeRepository extends JpaRepository<ProfissionalSaude, Long> {

    List<ProfissionalSaude> findAllByOrderByNomeAsc();

    List<ProfissionalSaude> findByNomeContainingIgnoreCase(String nome);

    List<ProfissionalSaude> findByCategoria(Categoria categoria);
}
