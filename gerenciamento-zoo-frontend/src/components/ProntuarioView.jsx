import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { paises } from '../data/paises';

function ProntuarioView({ animal, onBack }) {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Em espera');
  
  // Estado do Formulário
  const [novaDescricao, setNovaDescricao] = useState('');
  const [idEdicao, setIdEdicao] = useState(null); // 🚨 Guarda o ID se estivermos editando

  // Filtros (Visuais)
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

  // 🚨 Lógica Unificada: Salvar (POST) ou Editar (PUT)
  const handleSalvar = () => {
    if (!novaDescricao) return alert("Informe a descrição!");
    
    const dados = {
      id: idEdicao || 0, // Se for edição, usa o ID existente
      nome: "Prontuário",
      descricao: novaDescricao,
      frequencia: "Única",
      animalId: animal.id
    };

    const request = idEdicao 
      ? axios.put(`/api/Cuidados/${idEdicao}`, dados) // Atualiza
      : axios.post('/api/Cuidados', dados);           // Cria novo

    request
      .then(() => {
        setNovaDescricao('');
        setIdEdicao(null); // Sai do modo de edição
        fetchConsultas();
      })
      .catch(err => alert("Erro ao salvar."));
  };

  // 🚨 Preparar para Editar
  const handleEditar = (item) => {
    setNovaDescricao(item.descricao); // Joga o texto na caixa
    setIdEdicao(item.id); // Marca que estamos editando este ID
  };

  // 🚨 Excluir
  const handleExcluir = (id) => {
    if(!window.confirm("Tem certeza que deseja excluir este registro?")) return;
    
    axios.delete(`/api/Cuidados/${id}`)
      .then(() => fetchConsultas())
      .catch(() => alert("Erro ao excluir."));
  };

  // Cancelar Edição
  const cancelarEdicao = () => {
    setNovaDescricao('');
    setIdEdicao(null);
  };

  if (!animal) return null;

  return (
    <div className="consultas-view">
      
      {/* CARD DE FILTROS (Mantido igual) */}
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
                <label>Status consulta</label>
                <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                    <option value="">Status consulta</option>
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

      {/* CARD PRINCIPAL */}
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
                
                {/* CAIXA DE TEXTO (ADICIONAR/EDITAR) */}
                <div className="consulta-box-wrapper">
                    <div className="box-header">
                        <h4 className="section-title">
                            {idEdicao ? 'Editando Prontuário...' : 'Prontuário'}
                        </h4>
                        <span className="date-label">Dia {new Date().toLocaleDateString()}</span>
                    </div>
                    <textarea 
                        className="consulta-input-box" 
                        placeholder="Banho, tosa e alimentação."
                        value={novaDescricao}
                        onChange={(e) => setNovaDescricao(e.target.value)}
                        style={idEdicao ? {border: '2px solid #F59E0B'} : {}} // Borda amarela se editando
                    ></textarea>
                    
                    <div className="button-wrapper">
                        <button 
                            className="add-btn" 
                            onClick={handleSalvar}
                            style={idEdicao ? {backgroundColor: '#F59E0B'} : {}} // Botão amarelo se editando
                        >
                            {idEdicao ? 'Salvar Alteração' : 'Adicionar Prontuário'}
                        </button>
                        
                        {idEdicao && (
                            <button 
                                className="add-btn" 
                                onClick={cancelarEdicao}
                                style={{marginLeft: '10px', backgroundColor: '#666'}}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>

                {/* HISTÓRICO COM AÇÕES */}
                <div className="historico-wrapper">
                    <h4 className="section-title">Histórico de prontuário</h4>
                    <ul className="historico-list">
                        {consultas.map(c => (
                            <li key={c.id} className="historico-item">
                                <div>
                                    <span className="h-desc">{c.descricao}</span>
                                    <br/>
                                    <span className="h-date" style={{fontSize: '0.75em', color:'#aaa'}}>
                                        Data: {new Date().toLocaleDateString()}
                                    </span>
                                </div>
                                
                                {/* 🚨 Botões de Ação do Item */}
                                <div className="item-actions">
                                    <button className="icon-btn edit" onClick={() => handleEditar(c)} title="Editar">
                                        ✏️
                                    </button>
                                    <button className="icon-btn delete" onClick={() => handleExcluir(c.id)} title="Excluir">
                                        🗑️
                                    </button>
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