import { useState, useEffect } from 'react';
import { DashboardKPIsGrid } from '../components/organisms/DashboardKPIs';
import { Header } from '../components/organisms/Header';
import { AlertsPanel } from '../components/molecules/AlertsPanel';
import { TalhaoCard } from '../components/molecules/TalhaoCard';
import { MachineCard } from '../components/molecules/MachineCard';
import { SensorList } from '../components/molecules/SensorList';
import { 
  mockAlerts, 
  mockTalhoes, 
  mockMachines,
  mockSensorReadings 
} from '../mocks/data';
import { Card, CardContent, CardHeader, CardTitle } from '../components/atoms/Card';
import { MapPin, Tractor, Radio, Calendar, Sprout, Sparkles, Droplets, TrendingUp } from 'lucide-react';
import { db } from '../services/db';
import type { DashboardKPIs } from '../types';
import type { Operation } from '../services/db';

export function Dashboard() {
  const [kpis, setKpis] = useState<DashboardKPIs>({
    area_planted_ha: 0,
    area_sprayed_ha: 0,
    area_fertilized_ha: 0,
    sensors_online: 3,
    sensors_total: 4,
    avg_soil_moisture: 23.5,
    total_seeds_applied: 0,
    active_alerts: mockAlerts.length,
  });
  const [recentOperations, setRecentOperations] = useState<Operation[]>([]);

  // Carrega dados do banco ao montar o componente
  useEffect(() => {
    const loadDashboardData = async () => {
      await db.init();
      await db.seedInitialData();
      
      const allOperations = await db.getAllOperations();
      
      // Calcula KPIs baseado nas operações reais
      const plantingOps = allOperations.filter(op => op.type === 'planting');
      const sprayingOps = allOperations.filter(op => op.type === 'spraying');
      const fertilizingOps = allOperations.filter(op => op.type === 'fertilizing');
      
      // Soma áreas (usando Set para evitar duplicatas do mesmo talhão)
      const plantedTalhoes = new Set(plantingOps.map(op => op.talhaoId));
      const sprayedTalhoes = new Set(sprayingOps.map(op => op.talhaoId));
      const fertilizedTalhoes = new Set(fertilizingOps.map(op => op.talhaoId));
      
      const area_planted = mockTalhoes
        .filter(t => plantedTalhoes.has(t.properties.id))
        .reduce((sum, t) => sum + t.properties.area_ha, 0);
        
      const area_sprayed = mockTalhoes
        .filter(t => sprayedTalhoes.has(t.properties.id))
        .reduce((sum, t) => sum + t.properties.area_ha, 0);
        
      const area_fertilized = mockTalhoes
        .filter(t => fertilizedTalhoes.has(t.properties.id))
        .reduce((sum, t) => sum + t.properties.area_ha, 0);
      
      // Soma total de sementes plantadas
      const total_seeds = plantingOps.reduce((sum, op) => {
        return sum + (op.details.seedsPlanted || 0);
      }, 0);
      
      setKpis({
        area_planted_ha: area_planted,
        area_sprayed_ha: area_sprayed,
        area_fertilized_ha: area_fertilized,
        sensors_online: 3,
        sensors_total: 4,
        avg_soil_moisture: 23.5,
        total_seeds_applied: total_seeds,
        active_alerts: mockAlerts.length,
      });
      
      // Últimas 5 operações
      setRecentOperations(allOperations.slice(0, 5));
    };
    
    loadDashboardData();
  }, []);

  const handleResolveAlert = (alertId: string) => {
    console.log('Resolving alert:', alertId);
    // TODO: Implement alert resolution logic
  };
  
  const handleTalhaoClick = (talhaoId: string) => {
    console.log('Talhao clicked:', talhaoId);
    // Navega para o mapa e seleciona o talhão
    const talhao = mockTalhoes.find(t => t.properties.id === talhaoId);
    if (talhao) {
      (window as any).navigateTo('map');
    }
  };
  
  const handleMachineClick = (machineId: string) => {
    console.log('Machine clicked:', machineId);
    // TODO: Navigate to machine details or telemetry page
  };
  
  return (
    <div className="min-h-screen bg-neutral-light">
      <Header currentPage="dashboard" />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* KPIs */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-dark mb-4">
            Visão Geral
          </h2>
          <DashboardKPIsGrid data={kpis} />
        </section>
        
        {/* Alerts */}
        <section>
          <AlertsPanel alerts={mockAlerts} onResolve={handleResolveAlert} />
        </section>
        
        {/* Últimas Operações */}
        {recentOperations.length > 0 && (
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Últimas Operações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentOperations.map((operation) => {
                    const getOperationIcon = () => {
                      switch (operation.type) {
                        case 'planting': return <Sprout className="h-4 w-4 text-green-600" />;
                        case 'spraying': return <Sparkles className="h-4 w-4 text-purple-600" />;
                        case 'irrigation': return <Droplets className="h-4 w-4 text-blue-600" />;
                        case 'fertilizing': return <TrendingUp className="h-4 w-4 text-orange-600" />;
                        default: return <Calendar className="h-4 w-4 text-neutral-600" />;
                      }
                    };
                    
                    const getOperationLabel = () => {
                      switch (operation.type) {
                        case 'planting': return 'Plantio';
                        case 'spraying': return 'Pulverização';
                        case 'irrigation': return 'Irrigação';
                        case 'fertilizing': return 'Adubação';
                        case 'harvesting': return 'Colheita';
                        default: return operation.type;
                      }
                    };
                    
                    const getOperationColor = () => {
                      switch (operation.type) {
                        case 'planting': return 'border-green-200 bg-green-50';
                        case 'spraying': return 'border-purple-200 bg-purple-50';
                        case 'irrigation': return 'border-blue-200 bg-blue-50';
                        case 'fertilizing': return 'border-orange-200 bg-orange-50';
                        default: return 'border-neutral-200 bg-neutral-50';
                      }
                    };
                    
                    return (
                      <div 
                        key={operation.id} 
                        className={`p-3 rounded-lg border ${getOperationColor()}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">{getOperationIcon()}</div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-neutral-900">
                                  {getOperationLabel()}
                                </span>
                                <span className="text-xs text-neutral-500">•</span>
                                <span className="text-xs text-neutral-600">
                                  {operation.talhaoName}
                                </span>
                              </div>
                              <div className="text-xs text-neutral-600 mt-1">
                                {new Date(operation.date).toLocaleDateString('pt-BR', { 
                                  day: '2-digit', 
                                  month: 'short', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                                {' • '}
                                {operation.culture}
                                {' • '}
                                {operation.area.toFixed(1)} ha
                              </div>
                              {operation.details.seedsPlanted && (
                                <div className="text-xs text-neutral-500 mt-1">
                                  {new Intl.NumberFormat('pt-BR').format(operation.details.seedsPlanted)} sementes
                                </div>
                              )}
                              {operation.details.product && (
                                <div className="text-xs text-neutral-500 mt-1">
                                  Produto: {operation.details.product}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>
        )}
        
        {/* Talhões */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Talhões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockTalhoes.map((talhao) => (
                  <TalhaoCard
                    key={talhao.properties.id}
                    talhao={talhao}
                    onClick={() => handleTalhaoClick(talhao.properties.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Machines */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tractor className="h-5 w-5 text-primary" />
                Máquinas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockMachines.map((machine) => (
                  <MachineCard
                    key={machine.machine_id}
                    machine={machine}
                    onClick={() => handleMachineClick(machine.machine_id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Sensors */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-primary" />
                Sensores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SensorList sensors={mockSensorReadings} />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
