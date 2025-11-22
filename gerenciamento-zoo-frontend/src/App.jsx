import { useState, useEffect } from 'react';
import axios from 'axios';
import AnimalForm from './components/AnimalForm';
import AnimalList from './components/AnimalList';
import ProntuarioView from './components/ProntuarioView'; 

function App() {
  const [currentView, setCurrentView] = useState('cadastro');
  const [animalParaEditar, setAnimalParaEditar] = useState(null);
  const [animalParaConsulta, setAnimalParaConsulta] = useState(null); 
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleNavigation = (view) => {
    setCurrentView(view);
    if (view === 'cadastro') setAnimalParaEditar(null); 
    // Se sair da tela de prontuário, limpa a seleção
    if (view !== 'prontuario') setAnimalParaConsulta(null);
  };

  const handleEditAnimal = (animal) => {
    setAnimalParaEditar(animal);
    setCurrentView('cadastro');
  };

  const handleOpenProntuario = (animal) => {
    setAnimalParaConsulta(animal);
    setCurrentView('prontuario');
  };

  const handleAnimalSaved = () => {
    setCurrentView('lista');
    setAnimalParaEditar(null);
  };
  
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  return (
    <>
      <header>
        <div className="header-title-group" style={{ cursor: 'pointer' }} onClick={() => handleNavigation('cadastro')}>
          <img src="/LogoZooPet.png" alt="Logo Zoo Pet" className="zoo-logo" />
          <h1>Gerenciamento do Zoológico</h1>
        </div>
        
        <div className="header-nav-buttons">
            <button className={currentView === 'cadastro' ? 'active' : ''} onClick={() => handleNavigation('cadastro')}>Novo Cadastro</button>
            <button className={currentView === 'lista' ? 'active' : ''} onClick={() => handleNavigation('lista')}>Listar animais</button>
            <button className={currentView === 'prontuario' ? 'active' : ''} onClick={() => handleNavigation('prontuario')}>Prontuários</button>
            <button className="theme-toggle" onClick={() => setIsDarkMode(prev => !prev)}>
                {isDarkMode ? '🌞' : '🌙'}
            </button>
        </div>
      </header>
      
      <div className="app-container">
        <main>
          {/* TELA DE CADASTRO / EDIÇÃO */}
          {currentView === 'cadastro' && (
            <section className="section-cadastro">
              <AnimalForm onAnimalSaved={handleAnimalSaved} animalEditando={animalParaEditar} /> 
            </section>
          )}

          {/* TELA DE LISTAGEM */}
          {currentView === 'lista' && (
            <AnimalList onEdit={handleEditAnimal} onOpenProntuario={handleOpenProntuario} /> 
          )}

          {/* TELA DE PRONTUÁRIOS (ESPECÍFICA DO ANIMAL) */}
          {currentView === 'prontuario' && (
            animalParaConsulta ? (
              <ProntuarioView 
                  animal={animalParaConsulta} 
                  onBack={() => handleNavigation('lista')} 
              />
            ) : (
              // Tela de Aviso se clicar no menu sem selecionar animal
              <div className="form-container" style={{ textAlign: 'center', maxWidth: '600px' }}>
                  <h2 style={{ color: 'white', borderBottom: 'none' }}>Acesso aos Prontuários</h2>
                  <p style={{ color: 'white', marginBottom: '20px' }}>
                      Para acessar o prontuário e histórico clínico, selecione um animal na lista.
                  </p>
                  <button onClick={() => handleNavigation('lista')}>Ir para Lista de Animais</button>
              </div>
            )
          )}
        </main>
      </div>
    </>
  );
}

export default App;