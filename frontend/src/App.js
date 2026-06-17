import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProfissionalList from './components/ProfissionalList';
import ProfissionalForm from './components/ProfissionalForm';
import AtendimentoList from './components/AtendimentoList';
import AtendimentoForm from './components/AtendimentoForm';
import ExameLabList from './components/ExameLabList';
import ExameLabForm from './components/ExameLabForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1>Sistema de Saude</h1>
          <div className="nav-links">
            <Link to="/profissionais">Profissionais</Link>
            <Link to="/atendimentos">Atendimentos</Link>
            <Link to="/exames">Exames Lab</Link>
          </div>
        </nav>

        <main className="container">
          <Routes>
            <Route path="/" element={<ProfissionalList />} />
            <Route path="/profissionais" element={<ProfissionalList />} />
            <Route path="/profissionais/novo" element={<ProfissionalForm />} />
            <Route path="/profissionais/editar/:id" element={<ProfissionalForm />} />
            <Route path="/atendimentos" element={<AtendimentoList />} />
            <Route path="/atendimentos/novo" element={<AtendimentoForm />} />
            <Route path="/atendimentos/editar/:id" element={<AtendimentoForm />} />
            <Route path="/exames" element={<ExameLabList />} />
            <Route path="/exames/novo" element={<ExameLabForm />} />
            <Route path="/exames/editar/:id" element={<ExameLabForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
