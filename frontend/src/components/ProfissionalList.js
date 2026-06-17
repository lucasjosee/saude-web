import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profissionalService } from '../services/api';

const LABEL_CATEGORIA = {
  MEDICO: { label: 'Médico', cls: 'badge-medico' },
  FISIOTERAPEUTA: { label: 'Fisioterapeuta', cls: 'badge-fisio' },
  PSICOLOGO: { label: 'Psicólogo', cls: 'badge-psico' }
};

function ProfissionalList() {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    try {
      const response = await profissionalService.listar();
      setProfissionais(response.data);
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
    } finally {
      setLoading(false);
    }
  };

  const buscarPorNome = async () => {
    if (!filtroNome.trim()) { carregar(); return; }
    try {
      const response = await profissionalService.buscarPorNome(filtroNome);
      setProfissionais(response.data);
    } catch (error) {
      console.error('Erro ao buscar:', error);
    }
  };

  const buscarPorCategoria = async (cat) => {
    setFiltroCategoria(cat);
    if (!cat) { carregar(); return; }
    try {
      const response = await profissionalService.buscarPorCategoria(cat);
      setProfissionais(response.data);
    } catch (error) {
      console.error('Erro ao filtrar:', error);
    }
  };

  const deletar = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este profissional?')) {
      try {
        await profissionalService.deletar(id);
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
        <h2>Profissionais de Saude</h2>
        <Link to="/profissionais/novo" className="btn btn-primary">+ Novo Profissional</Link>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={filtroNome}
          onChange={e => setFiltroNome(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && buscarPorNome()}
          style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', flex: 1 }}
        />
        <button onClick={buscarPorNome} className="btn btn-primary">Buscar</button>
        <select
          value={filtroCategoria}
          onChange={e => buscarPorCategoria(e.target.value)}
          style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
        >
          <option value="">Todas as categorias</option>
          <option value="MEDICO">Médico</option>
          <option value="FISIOTERAPEUTA">Fisioterapeuta</option>
          <option value="PSICOLOGO">Psicólogo</option>
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {profissionais.map(prof => {
            const cat = LABEL_CATEGORIA[prof.categoria] || {};
            return (
              <tr key={prof.id}>
                <td>{prof.nome}</td>
                <td>{prof.telefone || '-'}</td>
                <td>{prof.endereco || '-'}</td>
                <td><span className={`badge ${cat.cls}`}>{cat.label}</span></td>
                <td>
                  <Link to={`/profissionais/editar/${prof.id}`} className="btn btn-sm">Editar</Link>
                  <button onClick={() => deletar(prof.id)} className="btn btn-danger btn-sm">Excluir</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {profissionais.length === 0 && <p className="empty">Nenhum profissional cadastrado.</p>}
    </div>
  );
}

export default ProfissionalList;
