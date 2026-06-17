package com.saude.repository;

import com.saude.model.ExameLab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExameLabRepository extends JpaRepository<ExameLab, Long> {

    List<ExameLab> findByAtendimentoId(Long atendimentoId);
}
