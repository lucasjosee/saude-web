import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { exameLabService } from '../services/api';

function ExameLabList() {
  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    try {
      const response = await exameLabService.listar();
      setExames(response.data);
    } catch (error) {
      console.error('Erro ao carregar exames:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletar = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este exame?')) {
      try {
        await exameLabService.deletar(id);
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
        <h2>Exames Laboratoriais</h2>
        <Link to="/exames/novo" className="btn btn-primary">+ Novo Exame</Link>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Resultado</th>
            <th>Atendimento (data)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {exames.map(ex => (
            <tr key={ex.id}>
              <td>{ex.descricao}</td>
              <td>{ex.resultado || '-'}</td>
              <td>{ex.atendimento?.data || '-'}</td>
              <td>
                <Link to={`/exames/editar/${ex.id}`} className="btn btn-sm">Editar</Link>
                <button onClick={() => deletar(ex.id)} className="btn btn-danger btn-sm">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {exames.length === 0 && <p className="empty">Nenhum exame cadastrado.</p>}
    </div>
  );
}

export default ExameLabList;
