import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const profissionalService = {
  listar: () => api.get('/profissionais'),
  buscar: (id) => api.get(`/profissionais/${id}`),
  buscarPorNome: (nome) => api.get(`/profissionais/buscar?nome=${nome}`),
  buscarPorCategoria: (cat) => api.get(`/profissionais/categoria/${cat}`),
  criar: (prof) => api.post('/profissionais', prof),
  atualizar: (id, prof) => api.put(`/profissionais/${id}`, prof),
  deletar: (id) => api.delete(`/profissionais/${id}`)
};

export const atendimentoService = {
  listar: () => api.get('/atendimentos'),
  buscar: (id) => api.get(`/atendimentos/${id}`),
  criar: (at) => api.post('/atendimentos', at),
  atualizar: (id, at) => api.put(`/atendimentos/${id}`, at),
  deletar: (id) => api.delete(`/atendimentos/${id}`)
};

export const exameLabService = {
  listar: () => api.get('/exames'),
  buscar: (id) => api.get(`/exames/${id}`),
  criar: (ex) => api.post('/exames', ex),
  atualizar: (id, ex) => api.put(`/exames/${id}`, ex),
  deletar: (id) => api.delete(`/exames/${id}`)
};

export default api;
