import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CuidadorForm({ onSaved, cuidadorEditando }) {
  const [nome, setNome] = useState('');
  const [registro, setRegistro] = useState('');
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    if (cuidadorEditando) {
      setNome(cuidadorEditando.nome || '');
      setRegistro(cuidadorEditando.registro || '');
    } else {
      resetForm();
    }
  }, [cuidadorEditando]);

  const resetForm = () => {
    setNome('');
    setRegistro('');
    setMensagem(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cuidador = {
      id: cuidadorEditando ? cuidadorEditando.id : 0,
      nome,
      registro
    };

    const request = cuidadorEditando
      ? axios.put(`/api/Cuidadores/${cuidador.id}`, cuidador)
      : axios.post('/api/Cuidadores', cuidador);

    request
      .then(() => {
        setMensagem({ type: 'success', text: 'Cuidador salvo com sucesso!' });
        if (!cuidadorEditando) resetForm();
        setTimeout(() => onSaved(), 1000);
      })
      .catch(error => {
        setMensagem({ type: 'error', text: 'Erro ao salvar cuidador.' });
        console.error(error);
      });
  };

  return (
    <div className="form-container">
      <h2>{cuidadorEditando ? 'Editar Cuidador' : 'Cadastro de Cuidador'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group">
            <label>Nome do Cuidador:</label>
            <input type="text" placeholder="Ex: João da Silva" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Registro / Matrícula:</label>
            <input type="text" placeholder="Ex: REG-1234" value={registro} onChange={(e) => setRegistro(e.target.value)} required />
          </div>
        </div>

        <div className="form-buttons">
          <button type="button" className="secondary-button" onClick={resetForm}>Limpar</button>
          <button type="submit">{cuidadorEditando ? 'Salvar Alterações' : 'Cadastrar'}</button>
        </div>
      </form>
      {mensagem && <p className={`message ${mensagem.type}`}>{mensagem.text}</p>}
    </div>
  );
}

export default CuidadorForm;