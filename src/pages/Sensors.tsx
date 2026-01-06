import { useState } from 'react';
import { Header } from '../components/organisms/Header';
import { Card, CardContent, CardHeader, CardTitle } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { 
  Radio, 
  Plus, 
  MapPin, 
  Activity, 
  Battery, 
  Thermometer,
  Droplets,
  Wind,
  X,
  Search,
  AlertTriangle
} from 'lucide-react';
import { mockSensorReadings, mockTalhoes } from '../mocks/data';
import type { SensorReading } from '../types';
import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN || '';

export function Sensors() {
  const [sensors, setSensors] = useState<SensorReading[]>(mockSensorReadings);
  const [selectedSensor, setSelectedSensor] = useState<SensorReading | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all');

  // Filtrar sensores
  const filteredSensors = sensors.filter(sensor => {
    const matchesSearch = sensor.sensor_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sensor.talhao_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'online' && sensor.status === 'online') ||
                         (filterStatus === 'offline' && sensor.status === 'offline');
    return matchesSearch && matchesStatus;
  });

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'soil_moisture': return <Droplets className="h-4 w-4" />;
      case 'temperature': return <Thermometer className="h-4 w-4" />;
      case 'humidity': return <Wind className="h-4 w-4" />;
      default: return <Radio className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'online' ? 'bg-green-500' : 'bg-red-500';
  };

  const handleAddSensor = (newSensor: Partial<SensorReading>) => {
    const sensor: SensorReading = {
      sensor_id: `SENS-${Date.now()}`,
      talhao_id: newSensor.talhao_id || '',
      type: newSensor.type as any || 'soil_moisture',
      value: 0,
      unit: newSensor.unit || '%',
      timestamp: new Date().toISOString(),
      status: 'online',
      battery_level: 100,
      location: newSensor.location || { lat: -26.195, lng: -52.707 },
      geo: { lat: -26.195, lon: -52.707 },
    };
    setSensors([...sensors, sensor]);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header currentPage="sensores" />

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Sensores</h1>
            <p className="text-neutral-600 mt-1">
              Gerencie e monitore os sensores da sua fazenda
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Sensor
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar por ID ou Talhão..."
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
              Todos ({sensors.length})
            </Button>
            <Button
              variant={filterStatus === 'online' ? 'primary' : 'secondary'}
              onClick={() => setFilterStatus('online')}
            >
              Online ({sensors.filter(s => s.status === 'online').length})
            </Button>
            <Button
              variant={filterStatus === 'offline' ? 'primary' : 'secondary'}
              onClick={() => setFilterStatus('offline')}
            >
              Offline ({sensors.filter(s => s.status === 'offline').length})
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total de Sensores</p>
                  <p className="text-2xl font-bold text-neutral-900">{sensors.length}</p>
                </div>
                <Radio className="h-8 w-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Online</p>
                  <p className="text-2xl font-bold text-green-600">
                    {sensors.filter(s => s.status === 'online').length}
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
                  <p className="text-sm text-neutral-600">Offline</p>
                  <p className="text-2xl font-bold text-red-600">
                    {sensors.filter(s => s.status === 'offline').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Bateria Média</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {Math.round(sensors.reduce((acc, s) => acc + (s.battery_level || 0), 0) / sensors.length)}%
                  </p>
                </div>
                <Battery className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sensors List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Sensores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredSensors.map((sensor) => (
                    <div
                      key={sensor.sensor_id}
                      onClick={() => setSelectedSensor(sensor)}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                        selectedSensor?.sensor_id === sensor.sensor_id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getSensorIcon(sensor.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-neutral-900">
                                {sensor.sensor_id}
                              </span>
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(sensor.status || 'offline')}`} />
                            </div>
                            <p className="text-sm text-neutral-600 mt-1">
                              Talhão: {mockTalhoes.find(t => t.properties.id === sensor.talhao_id)?.properties.name || sensor.talhao_id}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="text-neutral-700 font-medium">
                                {sensor.value} {sensor.unit}
                              </span>
                              <span className="text-neutral-500">
                                <Battery className="inline h-3 w-3 mr-1" />
                                {sensor.battery_level}%
                              </span>
                              <span className="text-neutral-500 text-xs">
                                {new Date(sensor.timestamp).toLocaleString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSensor(sensor);
                          }}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {filteredSensors.length === 0 && (
                    <div className="text-center py-8 text-neutral-500">
                      <Radio className="h-12 w-12 mx-auto mb-3 text-neutral-300" />
                      <p>Nenhum sensor encontrado</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sensor Details / Map */}
          <div className="lg:col-span-1">
            {selectedSensor ? (
              <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                  <CardTitle className="text-lg">Detalhes do Sensor</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSensor(null)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">ID do Sensor</p>
                    <p className="text-sm font-mono font-semibold">{selectedSensor.sensor_id}</p>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedSensor.status || 'offline')}`} />
                      <span className="text-sm font-medium capitalize">{selectedSensor.status}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Tipo</p>
                    <p className="text-sm font-semibold capitalize">
                      {selectedSensor.type.replace('_', ' ')}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Leitura Atual</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {selectedSensor.value} {selectedSensor.unit}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Nível de Bateria</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-neutral-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            (selectedSensor.battery_level || 0) > 50 ? 'bg-green-500' :
                            (selectedSensor.battery_level || 0) > 20 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${selectedSensor.battery_level}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold">{selectedSensor.battery_level}%</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Localização</p>
                    <p className="text-xs font-mono text-neutral-700">
                      Lat: {selectedSensor.location.lat.toFixed(6)}<br />
                      Lng: {selectedSensor.location.lng.toFixed(6)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Última Atualização</p>
                    <p className="text-xs text-neutral-700">
                      {new Date(selectedSensor.timestamp).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

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
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Radio className="h-16 w-16 mx-auto mb-4 text-neutral-300" />
                  <p className="text-neutral-500 mb-2">Nenhum sensor selecionado</p>
                  <p className="text-sm text-neutral-400">
                    Clique em um sensor para ver detalhes
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Add Sensor Modal */}
      {showAddModal && (
        <AddSensorModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddSensor}
        />
      )}
    </div>
  );
}

// Modal para adicionar sensor
function AddSensorModal({ onClose, onAdd }: { onClose: () => void; onAdd: (sensor: Partial<SensorReading>) => void }) {
  const [formData, setFormData] = useState({
    talhao_id: '',
    type: 'soil_moisture',
    unit: '%',
    lat: -26.195,
    lng: -52.707,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      talhao_id: formData.talhao_id,
      type: formData.type as any,
      unit: formData.unit,
      location: { lat: formData.lat, lng: formData.lng },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-start justify-between">
          <CardTitle>Adicionar Novo Sensor</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Talhão
              </label>
              <select
                value={formData.talhao_id}
                onChange={(e) => setFormData({ ...formData, talhao_id: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Selecione um talhão</option>
                {mockTalhoes.map((talhao) => (
                  <option key={talhao.properties.id} value={talhao.properties.id}>
                    {talhao.properties.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Tipo de Sensor
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="soil_moisture">Umidade do Solo</option>
                <option value="temperature">Temperatura</option>
                <option value="humidity">Umidade do Ar</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                Adicionar Sensor
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
