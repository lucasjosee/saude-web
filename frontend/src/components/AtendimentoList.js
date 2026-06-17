import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { atendimentoService } from '../services/api';

function AtendimentoList() {
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    try {
      const response = await atendimentoService.listar();
      setAtendimentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar atendimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletar = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este atendimento?')) {
      try {
        await atendimentoService.deletar(id);
        carregar();
      } catch (error) {
        console.error('Erro ao deletar:', error);
      }
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <div className="header">
        <h2>Atendimentos</h2>
        <Link to="/atendimentos/novo" className="btn btn-primary">+ Novo Atendimento</Link>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Horário</th>
            <th>Profissional</th>
            <th>Problema</th>
            <th>Receita</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {atendimentos.map(at => (
            <tr key={at.id}>
              <td>{at.data}</td>
              <td>{at.horario || '-'}</td>
              <td>{at.profissional?.nome || '-'}</td>
              <td>{at.problemaTex || '-'}</td>
              <td>{at.receitaSaude || '-'}</td>
              <td>
                <Link to={`/atendimentos/editar/${at.id}`} className="btn btn-sm">Editar</Link>
                <button onClick={() => deletar(at.id)} className="btn btn-danger btn-sm">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {atendimentos.length === 0 && <p className="empty">Nenhum atendimento cadastrado.</p>}
    </div>
  );
}

export default AtendimentoList;
