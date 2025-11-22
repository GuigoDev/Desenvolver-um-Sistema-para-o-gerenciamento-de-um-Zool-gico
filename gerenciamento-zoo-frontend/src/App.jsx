import { useState, useEffect } from 'react';
import axios from 'axios';
import AnimalForm from './components/AnimalForm';
import AnimalList from './components/AnimalList';
import ProntuarioView from './components/ProntuarioView'; 
import CuidadorForm from './components/CuidadorForm'; // 🚨 Import Novo
import CuidadorList from './components/CuidadorList'; // 🚨 Import Novo

function App() {
  const [currentView, setCurrentView] = useState('cadastro');
  const [animalParaEditar, setAnimalParaEditar] = useState(null);
  const [animalParaConsulta, setAnimalParaConsulta] = useState(null); 
  
  // 🚨 NOVO: Estado para edição de cuidador
  const [cuidadorParaEditar, setCuidadorParaEditar] = useState(null);

  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleNavigation = (view) => {
    setCurrentView(view);
    if (view === 'cadastro') setAnimalParaEditar(null);
    if (view === 'cuidadores-cadastro') setCuidadorParaEditar(null); // Limpa ao ir para novo cadastro
    if (view !== 'prontuario') setAnimalParaConsulta(null);
  };

  // Ações de Animais
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

  // 🚨 NOVAS: Ações de Cuidadores
  const handleEditCuidador = (cuidador) => {
    setCuidadorParaEditar(cuidador);
    setCurrentView('cuidadores-cadastro');
  };
  const handleCuidadorSaved = () => {
    setCurrentView('cuidadores-lista');
    setCuidadorParaEditar(null);
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
            <button onClick={() => handleNavigation('cadastro')}>Animais</button>
            <button onClick={() => handleNavigation('lista')}>Listar</button>
            <button onClick={() => handleNavigation('prontuario')}>Prontuários</button>
            
            {/* 🚨 NOVO BOTÃO DE MENU */}
            <button onClick={() => handleNavigation('cuidadores-lista')}>Cuidadores</button>

            <button className="theme-toggle" onClick={() => setIsDarkMode(prev => !prev)}>
                {isDarkMode ? '🌞' : '🌙'}
            </button>
        </div>
      </header>
      
      <div className="app-container">
        <main>
          {/* VIEW: Animais */}
          {currentView === 'cadastro' && (
            <section className="section-cadastro">
              <AnimalForm onAnimalSaved={handleAnimalSaved} animalEditando={animalParaEditar} /> 
            </section>
          )}
          {currentView === 'lista' && (
            <AnimalList onEdit={handleEditAnimal} onOpenProntuario={handleOpenProntuario} /> 
          )}

          {/* VIEW: Prontuários */}
          {currentView === 'prontuario' && (
            animalParaConsulta ? (
              <ProntuarioView 
                  animal={animalParaConsulta} 
                  onBack={() => handleNavigation('lista')} 
              />
            ) : (
              <div className="form-container" style={{ textAlign: 'center', maxWidth: '600px' }}>
                  <h2 style={{ color: 'white', borderBottom: 'none' }}>Acesso aos Prontuários</h2>
                  <p style={{ color: 'white', marginBottom: '20px' }}>
                      Selecione um animal na lista para ver o histórico.
                  </p>
                  <button onClick={() => handleNavigation('lista')}>Ir para Lista</button>
              </div>
            )
          )}

          {/* 🚨 NOVAS VIEWS: Cuidadores */}
          {currentView === 'cuidadores-lista' && (
               <CuidadorList 
                  onEdit={handleEditCuidador} 
                  onNew={() => handleNavigation('cuidadores-cadastro')} 
               />
          )}

          {currentView === 'cuidadores-cadastro' && (
             <CuidadorForm onSaved={handleCuidadorSaved} cuidadorEditando={cuidadorParaEditar} />
          )}

        </main>
      </div>
    </>
  );
}

export default App;