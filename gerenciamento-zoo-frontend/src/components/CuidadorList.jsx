import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CuidadorList({ onEdit, onNew }) { // Recebe a função onNew para criar
  const [cuidadores, setCuidadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  const fetchCuidadores = () => {
    setLoading(true);
    setTimeout(() => {
        axios.get('/api/Cuidadores')
        .then(response => {
            setCuidadores(Array.isArray(response.data) ? response.data : []);
            setLoading(false);
        })
        .catch(error => {
            console.error(error);
            setLoading(false);
        });
    }, 100);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Deseja excluir este cuidador?')) return;
    axios.delete(`/api/Cuidadores/${id}`).then(() => fetchCuidadores());
  };

  useEffect(() => { fetchCuidadores(); }, []);

  const filtrados = cuidadores.filter(c => 
    c.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <section className="section-lista">
      
      {/* Botão Novo Cuidador (Posicionado acima do card) */}
      <div className="cuidadores-actions">
        <button className="btn-novo-cuidador" onClick={onNew}>+ Novo Cuidador</button>
      </div>
      
      {/* Card de Filtro */}
      <div className="form-container cuidadores-filter-card">
        <h2>Equipe de Cuidadores</h2>
        
        {/* Grupo de Busca */}
        <div className="search-group">
            <div className="input-wrapper">
                <label>Buscar por nome:</label>
                <input 
                    type="text" 
                    placeholder="Digite o nome..." 
                    value={busca} 
                    onChange={(e) => setBusca(e.target.value)} 
                />
            </div>
            <button className="search-btn">Buscar</button>
        </div>
      </div>

      {/* Lista ou Mensagem Vazia */}
      {loading ? (
        <p style={{ textAlign: 'center', color: 'white' }}>Carregando...</p>
      ) : filtrados.length === 0 ? (
        <div className="empty-cuidadores-bar">
            <p>Nenhum cuidador encontrado.</p>
        </div>
      ) : (
        <div className="cuidadores-grid animal-grid"> 
          {filtrados.map(c => (
            <article key={c.id} className="animal-card">
              <div className="card-header">
                <h3>{c.nome}</h3>
              </div>
              <div className="card-body">
                <p><strong>Registro:</strong> {c.registro}</p>
                <p><strong>ID do Sistema:</strong> {c.id}</p>
              </div>
              <div className="card-actions">
                <button className="edit-button" onClick={() => onEdit(c)}>Editar</button>
                <button className="delete-button" onClick={() => handleDelete(c.id)}>Excluir</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default CuidadorList;