import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { especies } from '../data/especies';
import { paises } from '../data/paises';

function AnimalList({ onEdit, onOpenProntuario }) { 
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState(null);
  const [buscaNome, setBuscaNome] = useState('');
  const [buscaPais, setBuscaPais] = useState('');
  const [buscaEspecie, setBuscaEspecie] = useState('');
  const [buscaData, setBuscaData] = useState('');

  const fetchAnimais = () => {
    setLoading(true);
    setTimeout(() => {
      axios.get('/api/Animais')
        .then(response => {
          const data = Array.isArray(response.data) ? response.data : [];
          setAnimais(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Erro:', error);
          setLoading(false);
          setAnimais([]);
        });
    }, 100);
  };

  const handleDelete = (id) => {
    if (!window.confirm(`Deseja excluir este animal?`)) return;
    axios.delete(`/api/Animais/${id}`).then(() => fetchAnimais());
  };

  useEffect(() => { fetchAnimais(); }, []);

  const animaisFiltrados = animais.filter(animal => {
    const matchNome = animal.nome?.toLowerCase().includes(buscaNome.toLowerCase());
    const matchPais = buscaPais ? animal.paisDeOrigem === buscaPais : true;
    const matchEspecie = buscaEspecie ? animal.especie === buscaEspecie : true;
    const matchData = buscaData ? animal.dataNascimento?.startsWith(buscaData) : true;
    return matchNome && matchPais && matchEspecie && matchData;
  });

  return (
    <section className="section-lista">
      {mensagem && <p className={`global-message message ${mensagem.type}`}>{mensagem.text}</p>}

      <div className="form-container filter-card">
        <h2>Lista de Animais</h2>
        <div className="filter-grid">
            <div className="input-group">
                <label>Nome:</label>
                <input type="text" placeholder="Digite o nome..." value={buscaNome} onChange={(e) => setBuscaNome(e.target.value)} />
            </div>
            <div className="input-group">
                <label>País de origem:</label>
                <select value={buscaPais} onChange={(e) => setBuscaPais(e.target.value)}>
                    <option value="">Todos</option>
                    {paises.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
            <div className="input-group">
                <label>Espécie:</label>
                <select value={buscaEspecie} onChange={(e) => setBuscaEspecie(e.target.value)}>
                    <option value="">Todas</option>
                    {especies.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
            </div>
            <div className="input-group">
                <label>Data de nascimento:</label>
                <input type="date" value={buscaData} onChange={(e) => setBuscaData(e.target.value)} />
            </div>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'white' }}>Carregando...</p>
      ) : animaisFiltrados.length === 0 ? (
        <div className="empty-state-bar"><p>Ainda não foi cadastrado nenhum animal</p></div>
      ) : (
        <div className="animal-grid">
          {animaisFiltrados.map(animal => (
            <article key={animal.id} className="animal-card">
              
              <div className="card-header">
                <h3>{animal.nome}</h3>
                <button 
                    className="consulta-button"
                    onClick={() => onOpenProntuario(animal)} 
                >
                    Prontuário
                </button>
              </div>
              
              <div className="card-body">
                <p><strong>Espécie:</strong> {animal.especie}</p>
                <p><strong>Habitat:</strong> {animal.habitat}</p>
                <p><strong>Origem:</strong> {animal.paisDeOrigem}</p>
                <p><strong>Data de nascimento:</strong> {animal.dataNascimento ? new Date(animal.dataNascimento).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Descrição:</strong> {animal.descricao || 'Sem descrição'}</p>
              </div>
              
              <div className="card-actions">
                <button className="edit-button" onClick={() => onEdit(animal)}>Editar</button>
                <button className="delete-button" onClick={() => handleDelete(animal.id)}>Excluir</button>
              </div>

            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AnimalList;