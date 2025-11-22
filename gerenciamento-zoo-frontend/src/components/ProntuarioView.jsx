import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { paises } from '../data/paises';
import { tiposCuidados } from '../data/tiposCuidados';
import { frequencias } from '../data/frequencias';

function ProntuarioView({ animal, onBack }) {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados do Formulário
  const [status, setStatus] = useState('Em espera'); // Status padrão
  const [tipoCuidado, setTipoCuidado] = useState('');
  const [frequencia, setFrequencia] = useState('');
  const [descricao, setDescricao] = useState('');
  const [idEdicao, setIdEdicao] = useState(null);

  // Filtros Visuais
  const [filtroNome, setFiltroNome] = useState(animal?.nome || '');
  const [filtroPais, setFiltroPais] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroData, setFiltroData] = useState('');

  const fetchConsultas = () => {
    setLoading(true);
    axios.get('/api/Cuidados')
      .then(response => {
        const data = Array.isArray(response.data) ? response.data : [];
        
        // Filtra pelo animal atual
        let historico = data.filter(c => c.animalId === animal.id);

        // 🚨 ORDENAÇÃO POR PRIORIDADE (Em andamento > Em espera > Finalizado)
        const prioridade = { 'Em andamento': 1, 'Em espera': 2, 'Finalizado': 3 };
        historico.sort((a, b) => {
            const pA = prioridade[a.status] || 4;
            const pB = prioridade[b.status] || 4;
            return pA - pB;
        });

        setConsultas(historico);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (animal) fetchConsultas();
  }, [animal]);

  const handleSalvarProntuario = () => {
    if (!tipoCuidado || !frequencia || !descricao) {
        return alert("Preencha todos os campos obrigatórios.");
    }
    
    const dados = {
      id: idEdicao || 0,
      nome: tipoCuidado,
      frequencia: frequencia,
      descricao: descricao,
      status: status, // 🚨 Salva o status selecionado
      animalId: animal.id
    };

    const request = idEdicao 
      ? axios.put(`/api/Cuidados/${idEdicao}`, dados)
      : axios.post('/api/Cuidados', dados);

    request
      .then(() => {
        setTipoCuidado('');
        setFrequencia('');
        setDescricao('');
        setStatus('Em espera');
        setIdEdicao(null);
        fetchConsultas();
      })
      .catch(err => alert("Erro ao salvar."));
  };

  const handleExcluir = (id) => {
    if(!window.confirm("Excluir este registro?")) return;
    axios.delete(`/api/Cuidados/${id}`).then(() => fetchConsultas());
  };

  const handleEditar = (item) => {
    setTipoCuidado(item.nome);
    setFrequencia(item.frequencia);
    setDescricao(item.descricao);
    setStatus(item.status || 'Em espera'); // Carrega o status existente
    setIdEdicao(item.id);
  };

  const cancelarEdicao = () => {
    setTipoCuidado('');
    setFrequencia('');
    setDescricao('');
    setStatus('Em espera');
    setIdEdicao(null);
  };

  // Helper para cor do status
  const getStatusColor = (st) => {
      switch(st) {
          case 'Em andamento': return '#34D399'; // Verde
          case 'Finalizado': return '#6B7280';   // Cinza
          default: return '#F59E0B';             // Amarelo (Em espera)
      }
  };

  if (!animal) return null;

  return (
    <div className="consultas-view">
      
      <div className="form-container filter-card">
        <h2>Prontuários</h2>
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
                <label>Status:</label>
                <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                    <option value="">Todos</option>
                    <option value="Em espera">Em espera</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Finalizado">Finalizado</option>
                </select>
            </div>
            <div className="input-group">
                <label>Data:</label>
                <input type="date" value={filtroData} onChange={e => setFiltroData(e.target.value)} />
            </div>
        </div>
      </div>

      <div className="animal-detail-card">
        
        <div className="detail-header">
            <h2 className="animal-name">{animal.nome}</h2>
            
            {/* 🚨 Seletor de Status Global para o Novo Registro */}
            <div className="status-container">
                <span style={{color: 'white', fontSize: '1.5em', marginRight: '10px'}}>Status:</span>
                <select 
                    className="status-badge" 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ backgroundColor: getStatusColor(status) }}
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
                <p><strong>Habitat:</strong> {animal.habitat}</p>
                <p><strong>Origem:</strong> {animal.paisDeOrigem}</p>
                <p><strong>Nascimento:</strong> {animal.dataNascimento ? new Date(animal.dataNascimento).toLocaleDateString() : ''}</p>
                <p><strong>Descrição:</strong> {animal.descricao}</p>
            </div>

            <div className="action-column">
                
                <div className="consulta-box-wrapper">
                    <div className="box-header">
                        <h4 className="section-title">
                            {idEdicao ? 'Editando Registro...' : 'Novo Cuidado'}
                        </h4>
                        <span className="date-label">Hoje: {new Date().toLocaleDateString()}</span>
                    </div>
                    
                    <div className="mini-form-row">
                        <select className="mini-select" value={tipoCuidado} onChange={(e) => setTipoCuidado(e.target.value)}>
                            <option value="">Tipo de Cuidado...</option>
                            {tiposCuidados.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>

                        <select className="mini-select" value={frequencia} onChange={(e) => setFrequencia(e.target.value)}>
                            <option value="">Frequência...</option>
                            {frequencias.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>

                    <textarea 
                        className="consulta-input-box" 
                        placeholder="Descreva os detalhes do procedimento..."
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        style={idEdicao ? {border: '2px solid #F59E0B'} : {}}
                    ></textarea>
                    
                    <div className="button-wrapper">
                        <button 
                            className="add-btn" 
                            onClick={handleSalvarProntuario}
                            style={idEdicao ? {backgroundColor: '#F59E0B'} : {}}
                        >
                            {idEdicao ? 'Salvar Alteração' : 'Adicionar Registro'}
                        </button>
                        
                        {idEdicao && (
                            <button className="add-btn" onClick={cancelarEdicao} style={{marginLeft: '10px', backgroundColor: '#666'}}>Cancelar</button>
                        )}
                    </div>
                </div>

                <div className="historico-wrapper">
                    <h4 className="section-title">Histórico de Prontuários</h4>
                    <ul className="historico-list">
                        {consultas.map(c => (
                            <li key={c.id} className="historico-item">
                                <div style={{flex: 1}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px'}}>
                                        {/* 🚨 ALERTA VISUAL DE STATUS */}
                                        <span className="status-dot" style={{backgroundColor: getStatusColor(c.status || 'Em espera')}} title={c.status}></span>
                                        <strong style={{color: 'var(--color-primary)'}}>{c.nome}</strong>
                                        <span className="freq-tag">{c.frequencia}</span>
                                    </div>
                                    <span className="h-desc">{c.descricao}</span>
                                </div>
                                
                                <div className="item-actions">
                                    <button className="icon-btn edit" onClick={() => handleEditar(c)}>✏️</button>
                                    <button className="icon-btn delete" onClick={() => handleExcluir(c.id)}>🗑️</button>
                                </div>
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