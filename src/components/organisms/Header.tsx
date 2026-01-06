import { Sprout } from 'lucide-react';
import { Button } from '../atoms/Button';

interface HeaderProps {
  currentPage?: 'dashboard' | 'map' | 'sensores' | 'maquinas';
}

export function Header({ currentPage = 'dashboard' }: HeaderProps) {
  const navigate = (page: 'dashboard' | 'map' | 'sensores' | 'maquinas') => {
    (window as any).navigateTo?.(page);
  };

  return (
    <header className="bg-white border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sprout className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-neutral-950">Terris</h1>
            <p className="text-sm text-neutral-600">Agricultura de Precisão</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={currentPage === 'dashboard' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => navigate('dashboard')}
          >
            Dashboard
          </Button>
          <Button
            variant={currentPage === 'map' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => navigate('map')}
          >
            Mapa
          </Button>
          <Button
            variant={currentPage === 'sensores' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => navigate('sensores')}
          >
            Sensores
          </Button>
          <Button
            variant={currentPage === 'maquinas' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => navigate('maquinas')}
          >
            Máquinas
          </Button>
        </div>
      </div>
    </header>
  );
}
