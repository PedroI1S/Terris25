import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Talhao } from '../../types';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// Validar token do Mapbox
console.log('🔑 Mapbox Token check:', MAPBOX_TOKEN ? 'Found (Starts with ' + MAPBOX_TOKEN.substring(0, 4) + ')' : 'Missing/Empty');
console.log('🌍 Environment:', import.meta.env);

if (!MAPBOX_TOKEN) {
  console.error('❌ Token do Mapbox não encontrado. Configure VITE_MAPBOX_ACCESS_TOKEN no arquivo .env');
}

mapboxgl.accessToken = MAPBOX_TOKEN || '';

interface MapLayoutProps {
  talhoes: Talhao[];
  onTalhaoClick?: (talhao: Talhao) => void;
  center?: [number, number];
  zoom?: number;
}

export function MapLayout({
  talhoes,
  onTalhaoClick,
  center = [-52.707, -26.195], // Região de Francisco Beltrão/PR
  zoom = 13,
}: MapLayoutProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar se o token está configurado
  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            ❌ Token do Mapbox não configurado
          </h3>
          <p className="text-neutral-700 mb-4">
            Configure a variável <code className="bg-neutral-100 px-2 py-1 rounded">VITE_MAPBOX_ACCESS_TOKEN</code> no arquivo <code className="bg-neutral-100 px-2 py-1 rounded">.env</code>
          </p>
          <p className="text-sm text-neutral-600">
            Obtenha seu token em:{' '}
            <a
              href="https://account.mapbox.com/access-tokens/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
            >
              account.mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Inicializa o mapa
  useEffect(() => {
    console.log('🗺️ useEffect de inicialização do mapa disparado');
    console.log('   mapContainer.current:', mapContainer.current);
    console.log('   map.current:', map.current);

    if (!mapContainer.current) {
      console.log('⚠️ Pulando: mapContainer não existe');
      return;
    }

    if (map.current) {
      console.log('⚠️ Pulando: mapa já existe');
      return;
    }

    console.log('✨ Iniciando criação do mapa Mapbox...');

    try {
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: center,
        zoom: zoom,
      });

      map.current = mapInstance;
      console.log('✅ Mapa Mapbox criado:', map.current);

      // Adiciona controles de navegação
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Adiciona controle de escala
      map.current.addControl(
        new mapboxgl.ScaleControl({
          maxWidth: 100,
          unit: 'metric',
        }),
        'bottom-right'
      );

      // Aguarda o estilo carregar completamente
      map.current.on('style.load', () => {
        console.log('✅ Estilo do mapa carregado completamente');
        setMapLoaded(true);
      });

      mapInstance.on('error', (e) => {
        console.error('❌ Erro ao carregar o mapa:', e);
        setError(`Erro ao carregar o mapa: ${e.error?.message || 'Verifique o token do Mapbox'}`);
      });
    } catch (err) {
      console.error('❌ Erro ao inicializar o mapa:', err);
      setError(`Erro ao inicializar o mapa: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }

    return () => {
      console.log('🧹 Cleanup: removendo mapa');
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Array vazio = só executa UMA vez

  // Adiciona os talhões ao mapa
  useEffect(() => {
    if (!map.current || !mapLoaded || talhoes.length === 0) return;

    console.log('🗺️ Adicionando talhões ao mapa...');

    // Função para adicionar talhões com retry
    const addTalhoesWithRetry = (retries = 5, delay = 100) => {
      if (!map.current) return;

      // Verifica se o estilo está realmente carregado
      if (!map.current.isStyleLoaded()) {
        if (retries > 0) {
          console.log(`⏳ Aguardando estilo carregar... (${retries} tentativas restantes)`);
          setTimeout(() => addTalhoesWithRetry(retries - 1, delay), delay);
        } else {
          console.error('❌ Timeout: Estilo não carregou após várias tentativas');
          setError('Timeout ao carregar estilo do mapa. Tente recarregar a página.');
        }
        return;
      }

      try {
        // Remove source e layer existentes se já existirem
        if (map.current.getSource('talhoes')) {
          if (map.current.getLayer('talhoes-fill')) {
            map.current.removeLayer('talhoes-fill');
          }
          if (map.current.getLayer('talhoes-outline')) {
            map.current.removeLayer('talhoes-outline');
          }
          map.current.removeSource('talhoes');
        }

        // Cria GeoJSON FeatureCollection
        const geojsonData: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: talhoes,
        };

        // Adiciona source
        map.current.addSource('talhoes', {
          type: 'geojson',
          data: geojsonData,
        });

        // Adiciona layer de preenchimento
        map.current.addLayer({
          id: 'talhoes-fill',
          type: 'fill',
          source: 'talhoes',
          paint: {
            'fill-color': [
              'match',
              ['get', 'status'],
              'active',
              '#22c55e', // Verde mais vibrante para plantação ativa
              'inactive',
              '#a3a3a3', // Cinza para inativo
              'maintenance',
              '#fb923c', // Laranja mais vibrante para manutenção
              '#16a34a', // Verde padrão
            ],
            'fill-opacity': 0.3, // Mais transparente para parecer overlay
          },
        });

        // Adiciona layer de contorno
        map.current.addLayer({
          id: 'talhoes-outline',
          type: 'line',
          source: 'talhoes',
          paint: {
            'line-color': [
              'match',
              ['get', 'status'],
              'active',
              '#16a34a', // Verde escuro para ativo
              'inactive',
              '#737373', // Cinza escuro para inativo
              'maintenance',
              '#ea580c', // Laranja escuro para manutenção
              '#15803d', // Verde escuro padrão
            ],
            'line-width': 2,
            'line-opacity': 0.8,
          },
        });

        // Adiciona interatividade
        map.current.on('click', 'talhoes-fill', (e) => {
          if (!e.features || e.features.length === 0) return;

          const feature = e.features[0] as GeoJSON.Feature;
          const talhao = talhoes.find((t: Talhao) => t.properties.id === feature.properties?.id);

          if (talhao && onTalhaoClick) {
            onTalhaoClick(talhao);
          }

          // Cria popup com informações
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold text-base mb-1">${feature.properties?.name}</h3>
                <p class="text-sm text-gray-700">Área: ${feature.properties?.area_ha.toFixed(2)} ha</p>
                <p class="text-sm text-gray-700">Cultura: ${feature.properties?.culture}</p>
                <p class="text-sm text-gray-700">Status: ${feature.properties?.status}</p>
              </div>
            `)
            .addTo(map.current!);
        });

        // Muda cursor ao passar sobre talhão
        map.current.on('mouseenter', 'talhoes-fill', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = 'pointer';
          }
        });

        map.current.on('mouseleave', 'talhoes-fill', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = '';
          }
        });

        // Ajusta visualização para mostrar todos os talhões
        const bounds = new mapboxgl.LngLatBounds();
        talhoes.forEach((talhao) => {
          talhao.geometry.coordinates[0].forEach((coord) => {
            bounds.extend(coord as [number, number]);
          });
        });
        map.current.fitBounds(bounds, { padding: 50 });

        console.log('✅ Talhões adicionados ao mapa com sucesso');
      } catch (err) {
        console.error('❌ Erro ao adicionar talhões:', err);
        setError(`Erro ao adicionar talhões: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      }
    };

    addTalhoesWithRetry();
  }, [mapLoaded, talhoes, onTalhaoClick]);

  return (
    <div className="relative w-full h-full min-h-[600px]" style={{ width: '100%', height: '100%' }}>
      <div
        ref={mapContainer}
        className="absolute inset-0 rounded-lg overflow-hidden"
        style={{ width: '100%', height: '100%', minHeight: '600px' }}
      />

      {!mapLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Carregando mapa...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 rounded-lg">
          <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              ❌ Erro ao carregar o mapa
            </h3>
            <p className="text-neutral-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Recarregar página
            </button>
          </div>
        </div>
      )}

      {/* Legenda */}
      {mapLoaded && !error && (
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4 text-sm z-10 border border-neutral-200">
          <h4 className="font-bold text-neutral-900 mb-3 text-base">Status dos Talhões</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded border-2 border-green-700 bg-green-500/30"></div>
              <span className="text-neutral-700 font-medium">Ativo</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded border-2 border-neutral-700 bg-neutral-500/30"></div>
              <span className="text-neutral-700 font-medium">Inativo</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded border-2 border-orange-700 bg-orange-500/30"></div>
              <span className="text-neutral-700 font-medium">Manutenção</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
