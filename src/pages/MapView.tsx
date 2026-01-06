import { useState, useEffect } from 'react';
import { MapLayout } from '../components/organisms/MapLayout';
import { Header } from '../components/organisms/Header';
import { OperationsHistoryModal } from '../components/molecules/OperationsHistoryModal';
import { Card, CardContent, CardHeader, CardTitle } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { mockTalhoes } from '../mocks/data';
import type { Talhao } from '../types';
import { formatArea } from '../lib/utils';
import { MapPin, X, Sprout, Droplets, Sparkles, Calendar } from 'lucide-react';
import { db, CROP_SCHEDULES, type Operation } from '../services/db';

export function MapView() {
  const [selectedTalhao, setSelectedTalhao] = useState<Talhao | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [lastPlanting, setLastPlanting] = useState<Operation | null>(null);
  const [schedule, setSchedule] = useState<{
    plantingDate: Date;
    harvestDate: Date;
    sprayingDate: Date;
    irrigationDate: Date;
    sprayingNotes: string;
    irrigationNotes: string;
  } | null>(null);

  // Inicializa banco de dados
  useEffect(() => {
    const initDB = async () => {
      await db.init();
      await db.seedInitialData();
    };
    initDB();
  }, []);

  // Carrega dados quando seleciona um talhão
  useEffect(() => {
    if (selectedTalhao) {
      loadTalhaoData(selectedTalhao.properties.id);
    }
  }, [selectedTalhao]);

  const loadTalhaoData = async (talhaoId: string) => {
    const ops = await db.getOperationsByTalhao(talhaoId);
    setOperations(ops);

    const planting = await db.getLastPlanting(talhaoId);
    setLastPlanting(planting);

    if (planting && selectedTalhao) {
      const cropSchedule = CROP_SCHEDULES[selectedTalhao.properties.culture];
      if (cropSchedule) {
        const plantingDate = new Date(planting.date);
        setSchedule({
          plantingDate: plantingDate,
          harvestDate: new Date(plantingDate.getTime() + cropSchedule.daysToHarvest * 24 * 60 * 60 * 1000),
          sprayingDate: new Date(plantingDate.getTime() + cropSchedule.daysToFirstSpraying * 24 * 60 * 60 * 1000),
          irrigationDate: new Date(plantingDate.getTime() + cropSchedule.daysToIrrigation * 24 * 60 * 60 * 1000),
          sprayingNotes: cropSchedule.sprayingNotes,
          irrigationNotes: cropSchedule.irrigationNotes,
        });
      }
    }
  };

  const handleTalhaoClick = (talhao: Talhao) => {
    setSelectedTalhao(talhao);
  };

  const handleCloseDetails = () => {
    setSelectedTalhao(null);
    setOperations([]);
    setLastPlanting(null);
    setSchedule(null);
  };

  const handleViewHistory = () => {
    setShowHistoryModal(true);
  };

  const handleStartOperation = async () => {
    if (!selectedTalhao) return;

    // Adiciona nova operação de plantio
    const newOperation = {
      id: `op-${Date.now()}`,
      talhaoId: selectedTalhao.properties.id,
      talhaoName: selectedTalhao.properties.name,
      type: 'planting' as const,
      date: new Date().toISOString(),
      culture: selectedTalhao.properties.culture,
      area: selectedTalhao.properties.area_ha,
      details: {
        seedsPlanted: Math.floor(selectedTalhao.properties.area_ha * 280000),
        notes: 'Plantio autônomo realizado com sucesso',
      },
    };

    await db.addOperation(newOperation);
    await loadTalhaoData(selectedTalhao.properties.id);
    
    alert('Operação de plantio registrada com sucesso!');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header currentPage="map" />

      {/* Main Content */}
      <div className="relative h-[calc(100vh-80px)]">
        <div className="absolute inset-0 z-0">
          <MapLayout
            talhoes={mockTalhoes}
            onTalhaoClick={handleTalhaoClick}
          />
        </div>

        {/* Painel de Detalhes */}
        {selectedTalhao && (
          <div className="absolute top-4 right-4 w-96 max-h-[calc(100vh-120px)] overflow-y-auto z-10">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    {selectedTalhao.properties.name}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseDetails}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Informações Básicas */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Área</p>
                    <p className="text-lg font-semibold">
                      {formatArea(selectedTalhao.properties.area_ha)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Cultura</p>
                    <p className="text-lg font-semibold">
                      {selectedTalhao.properties.culture}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        selectedTalhao.properties.status === 'active'
                          ? 'bg-success-500'
                          : selectedTalhao.properties.status === 'maintenance'
                          ? 'bg-warning-500'
                          : 'bg-neutral-500'
                      }`}
                    />
                    <span className="text-sm font-medium capitalize">
                      {selectedTalhao.properties.status === 'active'
                        ? 'Ativo'
                        : selectedTalhao.properties.status === 'maintenance'
                        ? 'Manutenção'
                        : 'Inativo'}
                    </span>
                  </div>
                </div>

                {/* Última Operação de Plantio */}
                {lastPlanting && (
                  <div className="pt-4 border-t border-neutral-200">
                    <p className="text-xs text-neutral-500 mb-1">Último Plantio</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Sprout className="w-4 h-4 text-green-600" />
                      <span className="font-medium">
                        {new Date(lastPlanting.date).toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    {lastPlanting.details.seedsPlanted && (
                      <p className="text-xs text-neutral-600 mt-1">
                        {new Intl.NumberFormat('pt-BR').format(lastPlanting.details.seedsPlanted)} sementes plantadas
                      </p>
                    )}
                  </div>
                )}

                {/* Cronograma de Manejo */}
                {schedule && (
                  <div className="space-y-3 pt-4 border-t border-neutral-200">
                    <h4 className="font-semibold text-sm text-neutral-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary-600" />
                      Cronograma Previsto
                    </h4>
                    
                    <div className="space-y-2">
                      <div className="bg-purple-50 rounded p-2 border border-purple-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="h-3 w-3 text-purple-600" />
                          <span className="text-xs font-medium text-neutral-700">Pulverização</span>
                        </div>
                        <p className="text-xs text-neutral-900 font-semibold">
                          {schedule.sprayingDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                        </p>
                        <p className="text-xs text-neutral-600">{schedule.sprayingNotes}</p>
                      </div>

                      <div className="bg-blue-50 rounded p-2 border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Droplets className="h-3 w-3 text-blue-600" />
                          <span className="text-xs font-medium text-neutral-700">Irrigação</span>
                        </div>
                        <p className="text-xs text-neutral-900 font-semibold">
                          {schedule.irrigationDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                        </p>
                        <p className="text-xs text-neutral-600">{schedule.irrigationNotes}</p>
                      </div>

                      <div className="bg-green-50 rounded p-2 border border-green-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Sprout className="h-3 w-3 text-green-600" />
                          <span className="text-xs font-medium text-neutral-700">Colheita</span>
                        </div>
                        <p className="text-xs text-neutral-900 font-semibold">
                          {schedule.harvestDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                        <p className="text-xs text-neutral-600">
                          {CROP_SCHEDULES[selectedTalhao.properties.culture]?.daysToHarvest} dias após plantio
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sensores */}
                <div className="pt-4 border-t border-neutral-200">
                  <p className="text-xs text-neutral-500 mb-2">
                    Sensores ({selectedTalhao.properties.sensors.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTalhao.properties.sensors.map((sensorId) => (
                      <span
                        key={sensorId}
                        className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-md font-mono"
                      >
                        {sensorId}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Coordenadas */}
                <div>
                  <p className="text-xs text-neutral-500 mb-1">ID</p>
                  <p className="text-xs font-mono text-neutral-700">
                    {selectedTalhao.properties.id}
                  </p>
                </div>

                {/* Ações */}
                <div className="pt-2 space-y-2">
                  <Button variant="primary" className="w-full" onClick={handleViewHistory}>
                    Ver Histórico
                  </Button>
                  <Button variant="secondary" className="w-full" onClick={handleStartOperation}>
                    Iniciar Operação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Info Card - Estatísticas */}
        <div className="absolute top-4 left-4 w-80 z-10">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Total de Talhões</span>
                <span className="text-lg font-bold">{mockTalhoes.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Área Total</span>
                <span className="text-lg font-bold">
                  {formatArea(
                    mockTalhoes.reduce((sum, t) => sum + t.properties.area_ha, 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Ativos</span>
                <span className="text-lg font-bold text-success-600">
                  {mockTalhoes.filter((t) => t.properties.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Manutenção</span>
                <span className="text-lg font-bold text-warning-600">
                  {mockTalhoes.filter((t) => t.properties.status === 'maintenance').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Histórico */}
      {showHistoryModal && selectedTalhao && (
        <OperationsHistoryModal
          talhaoName={selectedTalhao.properties.name}
          operations={operations}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  );
}
