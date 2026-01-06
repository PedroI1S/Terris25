import { useState } from 'react';
import { MapView } from './pages/MapView';
import { Dashboard } from './pages/Dashboard';
import { Sensors } from './pages/Sensors';
import { Machines } from './pages/Machines';

type Page = 'map' | 'dashboard' | 'sensores' | 'maquinas';

function App() {
  // Verifica URL para determinar página inicial
  const getInitialPage = (): Page => {
    const path = window.location.pathname;
    if (path === '/sensores') return 'sensores';
    if (path === '/maquinas') return 'maquinas';
    if (path === '/map' || path === '/mapa') return 'map';
    return 'dashboard';
  };

  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage());

  // Atualiza URL quando muda de página
  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    const paths: Record<Page, string> = {
      dashboard: '/',
      map: '/map',
      sensores: '/sensores',
      maquinas: '/maquinas',
    };
    window.history.pushState({}, '', paths[page]);
  };

  // Expõe função de navegação globalmente
  (window as any).navigateTo = navigateTo;

  switch (currentPage) {
    case 'dashboard':
      return <Dashboard />;
    case 'map':
      return <MapView />;
    case 'sensores':
      return <Sensors />;
    case 'maquinas':
      return <Machines />;
    default:
      return <Dashboard />;
  }
}

export default App;
