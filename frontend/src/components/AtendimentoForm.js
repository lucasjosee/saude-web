import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { atendimentoService, profissionalService } from '../services/api';

const RECEITA_POR_CATEGORIA = {
  MEDICO: 'Remédio',
  FISIOTERAPEUTA: 'Atividade física',
  PSICOLOGO: 'Atividades mentais'
};

function AtendimentoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [atendimento, setAtendimento] = useState({
    data: '', horario: '', problemaTex: '', receitaSaude: '', profissional: null
  });
  const [profissionais, setProfissionais] = useState([]);

  useEffect(() => {
    profissionalService.listar().then(res => setProfissionais(res.data));
    if (id) {
      atendimentoService.buscar(id).then(res => setAtendimento(res.data));
    }
  }, [id]);

  const handleProfissionalChange = (profId) => {
    if (!profId) {
      setAtendimento({...atendimento, profissional: null, receitaSaude: ''});
      return;
    }
    const prof = profissionais.find(p => p.id === parseInt(profId));
    const receitaSugerida = prof ? RECEITA_POR_CATEGORIA[prof.categoria] : '';
    setAtendimento({
      ...atendimento,
      profissional: { id: parseInt(profId) },
      receitaSaude: receitaSugerida
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await atendimentoService.atualizar(id, atendimento);
      } else {
        await atendimentoService.criar(atendimento);
      }
      navigate('/atendimentos');
    } catch (error) {
      console.error('Erro ao salvar atendimento:', error);
    }
  };

  return (
    <div>
      <h2>{id ? 'Editar Atendimento' : 'Novo Atendimento'}</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Data *</label>
          <input type="date" value={atendimento.data} required
            onChange={e => setAtendimento({...atendimento, data: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Horário</label>
          <input type="time" value={atendimento.horario || ''}
            onChange={e => setAtendimento({...atendimento, horario: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Profissional</label>
          <select value={atendimento.profissional?.id || ''}
            onChange={e => handleProfissionalChange(e.target.value)}>
            <option value="">Selecione um profissional</option>
            {profissionais.map(p => (
              <option key={p.id} value={p.id}>{p.nome} ({p.categoria})</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Problema / Queixa</label>
          <textarea value={atendimento.problemaTex || ''}
            onChange={e => setAtendimento({...atendimento, problemaTex: e.target.value})}
            placeholder="Descreva o problema do paciente..." />
        </div>
        <div className="form-group">
          <label>Receita / Conduta</label>
          <textarea value={atendimento.receitaSaude || ''}
            onChange={e => setAtendimento({...atendimento, receitaSaude: e.target.value})}
            placeholder="Remédio / Atividade física / Atividades mentais..." />
        </div>
        <button type="submit" className="btn btn-primary">Salvar</button>
        <button type="button" className="btn" onClick={() => navigate('/atendimentos')}>Cancelar</button>
      </form>
    </div>
  );
}

export default AtendimentoForm;
