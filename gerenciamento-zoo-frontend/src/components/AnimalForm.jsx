import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { especies } from '../data/especies';
import { habitats } from '../data/habitats';
import { paises } from '../data/paises';

function AnimalForm({ onAnimalSaved, animalEditando }) {
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [habitat, setHabitat] = useState('');
  const [paisDeOrigem, setPaisDeOrigem] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    if (animalEditando) {
      setNome(animalEditando.nome || '');
      setEspecie(animalEditando.especie || '');
      setHabitat(animalEditando.habitat || '');
      setPaisDeOrigem(animalEditando.paisDeOrigem || '');
      setDescricao(animalEditando.descricao || '');
      if (animalEditando.dataNascimento) {
        setDataNascimento(animalEditando.dataNascimento.split('T')[0]);
      }
    } else {
      resetForm();
    }
  }, [animalEditando]);

  const resetForm = () => {
    setNome('');
    setEspecie('');
    setHabitat('');
    setPaisDeOrigem('');
    setDescricao('');
    setDataNascimento('');
    setMensagem(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const textoAcao = animalEditando ? 'Atualizando...' : 'Enviando cadastro...';
    setMensagem({ type: 'info', text: textoAcao });

    const dadosAnimal = {
      id: animalEditando ? animalEditando.id : 0,
      nome,
      especie,
      habitat,
      paisDeOrigem,
      descricao,
      dataNascimento: dataNascimento ? new Date(dataNascimento).toISOString() : null,
      dataEntradaNoZoo: animalEditando ? animalEditando.dataEntradaNoZoo : null 
    };

    const request = animalEditando 
      ? axios.put(`/api/Animais/${animalEditando.id}`, dadosAnimal)
      : axios.post('/api/Animais', [dadosAnimal]);

    request
      .then(() => {
        setMensagem({ type: 'success', text: 'Operação realizada com sucesso!' });
        if (!animalEditando) resetForm();
        setTimeout(() => onAnimalSaved(), 1000);
      })
      .catch(error => {
        const errorMsg = error.response?.data?.title || 'Erro na API.';
        setMensagem({ type: 'error', text: `Erro: ${errorMsg}` });
      });
  };

  return (
    <div className="form-container">
      <h2>{animalEditando ? 'Editar Animal' : 'Cadastro do animal'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group">
            <label>Nome:</label>
            <input type="text" placeholder="Digite o nome do animal..." value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Espécie:</label>
            <select value={especie} onChange={(e) => setEspecie(e.target.value)} required>
                <option value="">Selecione a Espécie</option>
                {especies.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label>Data de nascimento:</label>
            <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Habitat do animal:</label>
            <select value={habitat} onChange={(e) => setHabitat(e.target.value)}>
                <option value="">Selecione o Habitat</option>
                {habitats.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          
          <div className="input-group">
            <label>País de origem:</label>
            <select value={paisDeOrigem} onChange={(e) => setPaisDeOrigem(e.target.value)}>
                <option value="">Selecione o País</option>
                {paises.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="input-group"></div>

          <div className="input-group" style={{ gridColumn: '1 / 3' }}>
            <label>Descrição do animal:</label>
            <textarea placeholder="Informe aqui...." value={descricao} onChange={(e) => setDescricao(e.target.value)} rows="4"></textarea>
          </div>
        </div>

        <div className="form-buttons">
          <button type="button" className="secondary-button" onClick={resetForm}>Limpar dados</button>
          <button type="submit">{animalEditando ? 'Salvar Alterações' : 'Concluir'}</button>
        </div>
      </form>
      {mensagem && <p className={`message ${mensagem.type}`}>{mensagem.text}</p>}
    </div>
  );
}

export default AnimalForm;