import { Card, CardContent, CardHeader, CardTitle } from '../atoms/Card';
import type { SensorReading } from '../../types';
import { formatDateTime } from '../../lib/utils';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';

interface SensorItemProps {
  sensor: SensorReading;
}

export function SensorItem({ sensor }: SensorItemProps) {
  const statusIcons = {
    online: <Wifi className="h-5 w-5 text-success" />,
    offline: <WifiOff className="h-5 w-5 text-danger" />,
    warning: <AlertTriangle className="h-5 w-5 text-warning" />,
  };
  
  const statusLabels = {
    online: 'Online',
    offline: 'Offline',
    warning: 'Aviso',
  };
  
  const typeLabels: Record<string, string> = {
    soil_moisture: 'Umidade do Solo',
    temperature: 'Temperatura',
    planting_monitor: 'Monitor de Plantio',
    spray_rate: 'Taxa de Aplicação',
    fertilizer_rate: 'Taxa de Adubação',
    gps_tracker: 'GPS',
    flow_sensor: 'Sensor de Fluxo',
    bar_sensor: 'Sensor de Barra',
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{typeLabels[sensor.type] || sensor.type}</CardTitle>
          <div className="flex items-center gap-2">
            {sensor.status && statusIcons[sensor.status]}
            <span className="text-xs text-neutral-mid">
              {sensor.status && statusLabels[sensor.status]}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-bold text-neutral-dark">
          {sensor.value} <span className="text-sm text-neutral-mid">{sensor.unit}</span>
        </div>
        <div className="text-xs text-neutral-mid">
          ID: {sensor.sensor_id}
        </div>
        <div className="text-xs text-neutral-mid">
          {formatDateTime(sensor.timestamp)}
        </div>
        <div className="text-xs text-neutral-mid">
          Localização: {sensor.geo.lat.toFixed(4)}, {sensor.geo.lon.toFixed(4)}
        </div>
      </CardContent>
    </Card>
  );
}

interface SensorListProps {
  sensors: SensorReading[];
}

export function SensorList({ sensors }: SensorListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sensors.map((sensor) => (
        <SensorItem key={sensor.sensor_id} sensor={sensor} />
      ))}
    </div>
  );
}
