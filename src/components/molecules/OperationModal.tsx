import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { 
  X, 
  Play, 
  Pause, 
  Tractor, 
  Sprout, 
  Droplets, 
  Sparkles,
  AlertTriangle,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface OperationModalProps {
  talhaoName: string;
  talhaoArea: number;
  onClose: () => void;
  onStart: () => void;
  onProgressUpdate?: (progress: number, failedAreas: { lat: number; lng: number }[]) => void;
}

interface PlantingData {
  progress: number;
  seedsPlanted: number;
  coverageRate: number;
  failedAreas: number;
  estimatedYield: number;
  harvestDate: string;
  sprayingDate: string;
  irrigationDate: string;
}

export function OperationModal({ talhaoName, talhaoArea, onClose, onStart, onProgressUpdate }: OperationModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [plantingData, setPlantingData] = useState<PlantingData>({
    progress: 0,
    seedsPlanted: 0,
    coverageRate: 100,
    failedAreas: 0,
    estimatedYield: 0,
    harvestDate: '2025-02-15',
    sprayingDate: '2025-11-20',
    irrigationDate: '2025-12-05',
  });

  useEffect(() => {
    if (!isRunning || isPaused) return;

    const interval = setInterval(() => {
      setPlantingData(prev => {
        if (prev.progress >= 100) {
          setIsRunning(false);
          return prev;
        }

        // Simula progresso de plantio - ajustado para completar em ~1 minuto
        const newProgress = Math.min(prev.progress + 0.167, 100); // 100 / 60s = ~1.67% por segundo, dividido por 10 (100ms) = 0.167
        const seedsPerHa = 280000; // Soja: ~280k sementes/ha
        const totalSeeds = talhaoArea * seedsPerHa;
        const newSeedsPlanted = Math.floor((newProgress / 100) * totalSeeds);
        
        // Simula falhas aleatórias (5-10% da área)
        const failureRate = 0.05 + Math.random() * 0.05;
        const newCoverageRate = 100 - (failureRate * 100);
        const newFailedAreas = Math.floor((newProgress / 100) * talhaoArea * failureRate * 10) / 10;
        
        // Calcula previsão de colheita (kg/ha)
        const yieldPerHa = 3500; // Soja: ~3500 kg/ha
        const effectiveArea = talhaoArea * (newCoverageRate / 100);
        const newEstimatedYield = Math.floor((newProgress / 100) * effectiveArea * yieldPerHa);

        // Notifica o mapa sobre o progresso e áreas com falha
        if (onProgressUpdate) {
          // Gera coordenadas aleatórias para áreas com falha (para visualização)
          const failedAreaCoords: { lat: number; lng: number }[] = [];
          const numFailures = Math.floor(newFailedAreas * 2); // 2 pontos por hectare com falha
          
          for (let i = 0; i < numFailures; i++) {
            failedAreaCoords.push({
              lat: -26.195 + (Math.random() - 0.5) * 0.01, // Área do talhão
              lng: -52.707 + (Math.random() - 0.5) * 0.01,
            });
          }
          
          onProgressUpdate(newProgress, failedAreaCoords);
        }

        return {
          ...prev,
          progress: newProgress,
          seedsPlanted: newSeedsPlanted,
          coverageRate: newCoverageRate,
          failedAreas: newFailedAreas,
          estimatedYield: newEstimatedYield,
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, talhaoArea]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    onStart();
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-start justify-between border-b">
          <div>
            <CardTitle className="text-2xl">Operação Autônoma - {talhaoName}</CardTitle>
            <p className="text-sm text-neutral-600 mt-1">
              Plantio automatizado com monitoramento em tempo real
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Status da Operação */}
          <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Tractor className={`h-8 w-8 ${isRunning && !isPaused ? 'text-primary-600 animate-pulse' : 'text-neutral-400'}`} />
                <div>
                  <h3 className="font-semibold text-lg">Plantadeira Autônoma Terris X1</h3>
                  <p className="text-sm text-neutral-600">
                    {!isRunning ? 'Aguardando início' : isPaused ? 'Pausada' : 'Em operação'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {!isRunning ? (
                  <Button onClick={handleStart} className="gap-2">
                    <Play className="h-4 w-4" />
                    Iniciar Operação
                  </Button>
                ) : (
                  <Button 
                    onClick={handlePauseResume} 
                    variant={isPaused ? 'primary' : 'secondary'}
                    className="gap-2"
                  >
                    {isPaused ? (
                      <>
                        <Play className="h-4 w-4" />
                        Retomar
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4" />
                        Pausar
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Progresso do Plantio</span>
                <span className="font-semibold">{plantingData.progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-primary-600 h-full transition-all duration-300 ease-linear"
                  style={{ width: `${plantingData.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Métricas em Tempo Real */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sprout className="h-5 w-5 text-green-600" />
                <span className="text-sm text-neutral-600">Sementes Plantadas</span>
              </div>
              <p className="text-2xl font-bold text-neutral-900">
                {formatNumber(plantingData.seedsPlanted)}
              </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-neutral-600">Taxa de Cobertura</span>
              </div>
              <p className="text-2xl font-bold text-neutral-900">
                {plantingData.coverageRate.toFixed(1)}%
              </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="text-sm text-neutral-600">Áreas com Falha</span>
              </div>
              <p className="text-2xl font-bold text-neutral-900">
                {plantingData.failedAreas.toFixed(1)} ha
              </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sprout className="h-5 w-5 text-primary-600" />
                <span className="text-sm text-neutral-600">Previsão Colheita</span>
              </div>
              <p className="text-2xl font-bold text-neutral-900">
                {formatNumber(plantingData.estimatedYield)} kg
              </p>
            </div>
          </div>

          {/* Cronograma Previsto */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Cronograma Previsto de Manejo
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-neutral-700">Pulverização</span>
                </div>
                <p className="text-sm text-neutral-900 font-semibold">
                  {formatDate(plantingData.sprayingDate)}
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  Herbicida pós-emergência
                </p>
              </div>

              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-neutral-700">Irrigação</span>
                </div>
                <p className="text-sm text-neutral-900 font-semibold">
                  {formatDate(plantingData.irrigationDate)}
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  Fase vegetativa V4-V6
                </p>
              </div>

              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Sprout className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-neutral-700">Colheita</span>
                </div>
                <p className="text-sm text-neutral-900 font-semibold">
                  {formatDate(plantingData.harvestDate)}
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  120 dias após plantio
                </p>
              </div>
            </div>
          </div>

          {/* Alertas de Falha */}
          {plantingData.failedAreas > 0 && isRunning && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-900 mb-1">
                    Áreas com Baixa Taxa de Plantio Detectadas
                  </h4>
                  <p className="text-sm text-orange-800">
                    O sistema identificou {plantingData.failedAreas.toFixed(1)} hectares com cobertura abaixo do esperado. 
                    Recomenda-se revisão manual ou repassagem após conclusão da operação.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Conclusão */}
          {plantingData.progress >= 100 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sprout className="h-6 w-6 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1 text-lg">
                    ✅ Operação Concluída com Sucesso!
                  </h4>
                  <p className="text-sm text-green-800 mb-3">
                    O plantio do {talhaoName} foi finalizado. Total de {formatNumber(plantingData.seedsPlanted)} sementes 
                    plantadas em {talhaoArea} hectares.
                  </p>
                  <Button onClick={onClose} className="gap-2">
                    Fechar e Visualizar Mapa
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
