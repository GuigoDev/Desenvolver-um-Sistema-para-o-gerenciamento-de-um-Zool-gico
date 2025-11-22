import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { paises } from '../data/paises';

function ProntuarioView({ animal, onBack }) {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Em espera');
  const [novaDescricao, setNovaDescricao] = useState('');

  // Filtros
  const [filtroNome, setFiltroNome] = useState(animal?.nome || '');
  const [filtroPais, setFiltroPais] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroData, setFiltroData] = useState('');

  const fetchConsultas = () => {
    setLoading(true);
    axios.get('/api/Cuidados')
      .then(response => {
        const data = Array.isArray(response.data) ? response.data : [];
        const historico = data.filter(c => c.animalId === animal.id);
        setConsultas(historico);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (animal) fetchConsultas();
  }, [animal]);

  const handleAdicionarProntuario = () => {
    if (!novaDescricao) return alert("Informe a descrição!");
    
    const nova = {
      nome: "Prontuário",
      descricao: novaDescricao,
      frequencia: "Única",
      animalId: animal.id
    };

    axios.post('/api/Cuidados', nova)
      .then(() => {
        setNovaDescricao('');
        fetchConsultas();
      })
      .catch(err => alert("Erro ao salvar."));
  };

  if (!animal) return null;

  return (
    <div className="consultas-view">
      <div className="form-container filter-card">
        <h2>Prontuário</h2>
        <div className="filter-grid">
            <div className="input-group">
                <label>Nome:</label>
                <input type="text" value={filtroNome} onChange={e => setFiltroNome(e.target.value)} />
            </div>
            <div className="input-group">
                <label>País de origem:</label>
                <select value={filtroPais} onChange={e => setFiltroPais(e.target.value)}>
                    <option value="">Brasil</option>
                    {paises.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
            <div className="input-group">
                <label>Satus consulta</label>
                <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                    <option value="">Satus consulta</option>
                    <option value="Em espera">Em espera</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Finalizado">Finalizado</option>
                </select>
            </div>
            <div className="input-group">
                <label>Data de consulta:</label>
                <input type="date" value={filtroData} onChange={e => setFiltroData(e.target.value)} />
            </div>
        </div>
      </div>
      <div className="animal-detail-card">
        
        <div className="detail-header">
            <h2 className="animal-name">{animal.nome}</h2>
            <div className="status-container">
                <span style={{color: 'white', fontSize: '1.5em', marginRight: '10px'}}>Status:</span>
                <select 
                    className="status-badge" 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="Em espera">Em espera</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Finalizado">Finalizado</option>
                </select>
            </div>
        </div>

        <div className="detail-body">
            <div className="info-column">
                <p><strong>Espécie:</strong> {animal.especie}</p>
                <p><strong>habitat:</strong> {animal.habitat}</p>
                <p><strong>Origem:</strong> {animal.paisDeOrigem}</p>
                <p><strong>Data de nascimento:</strong> {animal.dataNascimento ? new Date(animal.dataNascimento).toLocaleDateString() : ''}</p>
                <p><strong>Descrição:</strong> {animal.descricao}</p>
            </div>

            <div className="action-column">
                <div className="consulta-box-wrapper">
                    <div className="box-header">
                        <h4 className="section-title">Prontuário</h4>
                        <span className="date-label">Dia {new Date().toLocaleDateString()}</span>
                    </div>
                    <textarea 
                        className="consulta-input-box" 
                        placeholder="Banho, tosa e alimentação."
                        value={novaDescricao}
                        onChange={(e) => setNovaDescricao(e.target.value)}
                    ></textarea>
                    
                    <div className="button-wrapper">
                        <button className="add-btn" onClick={handleAdicionarProntuario}>Adicionar Prontuário</button>
                    </div>
                </div>
                <div className="historico-wrapper">
                    <h4 className="section-title">Histórico de prontuário</h4>
                    <ul className="historico-list">
                        {consultas.map(c => (
                            <li key={c.id} className="historico-item">
                                <span className="h-desc">{c.descricao}</span>
                                <span className="h-date">Dia {new Date().toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                    
                    <div className="button-wrapper-right">
                        <button className="finalize-btn" onClick={onBack}>Finalizar</button>
                    </div>
                </div>

            </div>
        </div>
      </div>

    </div>
  );
}

export default ProntuarioView;