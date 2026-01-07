import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { MapView } from './pages/MapView';
import { Dashboard } from './pages/Dashboard';
import { Sensors } from './pages/Sensors';
import { Machines } from './pages/Machines';
import { useEffect } from 'react';

// Componente auxiliar para expor a navegação globalmente (mantendo compatibilidade)
function NavigationExposer() {
  const navigate = useNavigate();

  useEffect(() => {
    (window as any).navigateTo = (page: string) => {
      const path = page === 'dashboard' ? '/' : `/${page}`;
      navigate(path);
    };
  }, [navigate]);

  return null;
}

function App() {
  // O basename deve corresponder ao caminho do repositório no GitHub Pages
  // Em desenvolvimento (localhost) é '/', em produção é '/Terris25/'
  const basename = import.meta.env.PROD ? '/Terris25' : '/';

  return (
    <Router basename={basename}>
      <NavigationExposer />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/sensores" element={<Sensors />} />
        <Route path="/maquinas" element={<Machines />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
