import { useState } from 'react';
import { Header } from '../components/organisms/Header';
import { Card, CardContent, CardHeader, CardTitle } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { 
  Tractor, 
  Plus, 
  MapPin, 
  Activity, 
  Wrench,
  X,
  Search,
  Clock,
  Gauge,
  Navigation
} from 'lucide-react';
import { mockMachines } from '../mocks/data';
import type { Machine } from '../types';

export function Machines() {
  const [machines, setMachines] = useState<Machine[]>(mockMachines);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'maintenance'>('all');

  // Filtrar máquinas
  const filteredMachines = machines.filter(machine => {
    const matchesSearch = machine.machine_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         machine.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || machine.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getMachineIcon = (type: string) => {
    switch (type) {
      case 'tractor': return <Tractor className="h-5 w-5" />;
      case 'sprayer': return <Tractor className="h-5 w-5" />;
      case 'harvester': return <Tractor className="h-5 w-5" />;
      case 'planter': return <Tractor className="h-5 w-5" />;
      default: return <Tractor className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-neutral-500';
      case 'maintenance': return 'bg-orange-500';
      default: return 'bg-neutral-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'inactive': return 'Inativa';
      case 'maintenance': return 'Manutenção';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'tractor': return 'Trator';
      case 'sprayer': return 'Pulverizador';
      case 'harvester': return 'Colheitadeira';
      case 'planter': return 'Plantadeira';
      default: return type;
    }
  };

  const handleAddMachine = (newMachine: Partial<Machine>) => {
    const machine: Machine = {
      machine_id: `MACH-${Date.now()}`,
      name: newMachine.name || 'Nova Máquina',
      type: newMachine.type || 'tractor',
      status: 'inactive',
      hours_operation: 0,
    };
    setMachines([...machines, machine]);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header currentPage="maquinas" />

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Máquinas</h1>
            <p className="text-neutral-600 mt-1">
              Gerencie e monitore as máquinas da sua fazenda
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Máquina
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar por ID ou Nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'primary' : 'secondary'}
              onClick={() => setFilterStatus('all')}
            >
              Todas ({machines.length})
            </Button>
            <Button
              variant={filterStatus === 'active' ? 'primary' : 'secondary'}
              onClick={() => setFilterStatus('active')}
            >
              Ativas ({machines.filter(m => m.status === 'active').length})
            </Button>
            <Button
              variant={filterStatus === 'inactive' ? 'primary' : 'secondary'}
              onClick={() => setFilterStatus('inactive')}
            >
              Inativas ({machines.filter(m => m.status === 'inactive').length})
            </Button>
            <Button
              variant={filterStatus === 'maintenance' ? 'primary' : 'secondary'}
              onClick={() => setFilterStatus('maintenance')}
            >
              Manutenção ({machines.filter(m => m.status === 'maintenance').length})
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total de Máquinas</p>
                  <p className="text-2xl font-bold text-neutral-900">{machines.length}</p>
                </div>
                <Tractor className="h-8 w-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Ativas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {machines.filter(m => m.status === 'active').length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Manutenção</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {machines.filter(m => m.status === 'maintenance').length}
                  </p>
                </div>
                <Wrench className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Horas Totais</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {Math.round(machines.reduce((acc, m) => acc + (m.hours_operation || 0), 0))}h
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Machines List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Máquinas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredMachines.map((machine) => (
                    <div
                      key={machine.machine_id}
                      onClick={() => setSelectedMachine(machine)}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                        selectedMachine?.machine_id === machine.machine_id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getMachineIcon(machine.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-neutral-900">
                                {machine.name}
                              </span>
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(machine.status)}`} />
                            </div>
                            <p className="text-sm text-neutral-600 mt-1">
                              {getTypeLabel(machine.type)} • {machine.machine_id}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="text-neutral-700">
                                Status: <span className="font-medium">{getStatusLabel(machine.status)}</span>
                              </span>
                              {machine.hours_operation && (
                                <span className="text-neutral-500">
                                  <Clock className="inline h-3 w-3 mr-1" />
                                  {machine.hours_operation}h
                                </span>
                              )}
                              {machine.operator && (
                                <span className="text-neutral-500 text-xs">
                                  Operador: {machine.operator}
                                </span>
                              )}
                            </div>
                            {machine.current_position && machine.speed && (
                              <div className="flex items-center gap-3 mt-2 text-xs text-neutral-600">
                                <span className="flex items-center gap-1">
                                  <Gauge className="h-3 w-3" />
                                  {machine.speed} km/h
                                </span>
                                {machine.heading && (
                                  <span className="flex items-center gap-1">
                                    <Navigation className="h-3 w-3" />
                                    {machine.heading}°
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMachine(machine);
                          }}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {filteredMachines.length === 0 && (
                    <div className="text-center py-8 text-neutral-500">
                      <Tractor className="h-12 w-12 mx-auto mb-3 text-neutral-300" />
                      <p>Nenhuma máquina encontrada</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Machine Details */}
          <div className="lg:col-span-1">
            {selectedMachine ? (
              <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                  <CardTitle className="text-lg">Detalhes da Máquina</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMachine(null)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Nome</p>
                    <p className="text-sm font-semibold">{selectedMachine.name}</p>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-500 mb-1">ID</p>
                    <p className="text-xs font-mono font-semibold">{selectedMachine.machine_id}</p>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedMachine.status)}`} />
                      <span className="text-sm font-medium">{getStatusLabel(selectedMachine.status)}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Tipo</p>
                    <p className="text-sm font-semibold">{getTypeLabel(selectedMachine.type)}</p>
                  </div>

                  {selectedMachine.operator && (
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Operador</p>
                      <p className="text-sm font-semibold">{selectedMachine.operator}</p>
                    </div>
                  )}

                  {selectedMachine.hours_operation !== undefined && (
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Horas de Operação</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {selectedMachine.hours_operation}h
                      </p>
                    </div>
                  )}

                  {selectedMachine.current_position && (
                    <>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Localização Atual</p>
                        <p className="text-xs font-mono text-neutral-700">
                          Lat: {selectedMachine.current_position.lat.toFixed(6)}<br />
                          Lng: {selectedMachine.current_position.lon.toFixed(6)}
                        </p>
                      </div>

                      {selectedMachine.speed !== undefined && (
                        <div>
                          <p className="text-xs text-neutral-500 mb-1">Velocidade</p>
                          <p className="text-lg font-bold text-neutral-900">
                            {selectedMachine.speed} km/h
                          </p>
                        </div>
                      )}

                      {selectedMachine.heading !== undefined && (
                        <div>
                          <p className="text-xs text-neutral-500 mb-1">Direção</p>
                          <p className="text-lg font-bold text-neutral-900">
                            {selectedMachine.heading}°
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  <div className="pt-2 space-y-2">
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => {
                        (window as any).navigateTo('map');
                      }}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Ver no Mapa
                    </Button>
                    
                    {selectedMachine.status === 'active' && (
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => {
                          const updated = machines.map(m => 
                            m.machine_id === selectedMachine.machine_id 
                              ? { ...m, status: 'inactive' as const }
                              : m
                          );
                          setMachines(updated);
                          setSelectedMachine({ ...selectedMachine, status: 'inactive' });
                        }}
                      >
                        Parar Máquina
                      </Button>
                    )}
                    
                    {selectedMachine.status === 'inactive' && (
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => {
                          const updated = machines.map(m => 
                            m.machine_id === selectedMachine.machine_id 
                              ? { ...m, status: 'active' as const }
                              : m
                          );
                          setMachines(updated);
                          setSelectedMachine({ ...selectedMachine, status: 'active' });
                        }}
                      >
                        Ativar Máquina
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Tractor className="h-16 w-16 mx-auto mb-4 text-neutral-300" />
                  <p className="text-neutral-500 mb-2">Nenhuma máquina selecionada</p>
                  <p className="text-sm text-neutral-400">
                    Clique em uma máquina para ver detalhes
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Add Machine Modal */}
      {showAddModal && (
        <AddMachineModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddMachine}
        />
      )}
    </div>
  );
}

// Modal para adicionar máquina
function AddMachineModal({ onClose, onAdd }: { onClose: () => void; onAdd: (machine: Partial<Machine>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'tractor' as Machine['type'],
    operator: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-start justify-between">
          <CardTitle>Adicionar Nova Máquina</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Nome da Máquina
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Trator John Deere 7230"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Tipo de Máquina
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Machine['type'] })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="tractor">Trator</option>
                <option value="planter">Plantadeira</option>
                <option value="sprayer">Pulverizador</option>
                <option value="harvester">Colheitadeira</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Operador (opcional)
              </label>
              <input
                type="text"
                value={formData.operator}
                onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Nome do operador"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                Adicionar Máquina
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
