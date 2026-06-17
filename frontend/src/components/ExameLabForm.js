import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { exameLabService, atendimentoService } from '../services/api';

function ExameLabForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [exame, setExame] = useState({
    descricao: '', resultado: '', atendimento: null
  });
  const [atendimentos, setAtendimentos] = useState([]);

  useEffect(() => {
    atendimentoService.listar().then(res => setAtendimentos(res.data));
    if (id) {
      exameLabService.buscar(id).then(res => setExame(res.data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await exameLabService.atualizar(id, exame);
      } else {
        await exameLabService.criar(exame);
      }
      navigate('/exames');
    } catch (error) {
      console.error('Erro ao salvar exame:', error);
    }
  };

  return (
    <div>
      <h2>{id ? 'Editar Exame' : 'Novo Exame Laboratorial'}</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Descrição *</label>
          <textarea value={exame.descricao} required
            onChange={e => setExame({...exame, descricao: e.target.value})}
            placeholder="Descreva o exame solicitado..." />
        </div>
        <div className="form-group">
          <label>Resultado</label>
          <textarea value={exame.resultado || ''}
            onChange={e => setExame({...exame, resultado: e.target.value})}
            placeholder="Resultado do exame..." />
        </div>
        <div className="form-group">
          <label>Atendimento vinculado</label>
          <select value={exame.atendimento?.id || ''}
            onChange={e => setExame({...exame,
              atendimento: e.target.value ? { id: parseInt(e.target.value) } : null})}>
            <option value="">Selecione um atendimento</option>
            {atendimentos.map(at => (
              <option key={at.id} value={at.id}>
                {at.data} {at.horario ? `- ${at.horario}` : ''} {at.profissional ? `(${at.profissional.nome})` : ''}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Salvar</button>
        <button type="button" className="btn" onClick={() => navigate('/exames')}>Cancelar</button>
      </form>
    </div>
  );
}

export default ExameLabForm;
