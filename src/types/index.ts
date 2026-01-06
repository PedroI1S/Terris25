import type { Feature, Polygon, FeatureCollection } from 'geojson';

export interface TalhaoProperties {
  id: string;
  name: string;
  area_ha: number;
  culture: string;
  created_at: string;
  sensors: string[];
  status?: 'active' | 'inactive' | 'maintenance';
  last_operation?: string;
}

export type Talhao = Feature<Polygon, TalhaoProperties>;

export interface SensorReading {
  sensor_id: string;
  type: SensorType;
  talhao_id: string;
  timestamp: string;
  value: number;
  unit: string;
  geo: {
    lat: number;
    lon: number;
  };
  status?: 'online' | 'offline' | 'warning';
  battery_level?: number;
  location: {
    lat: number;
    lng: number;
  };
}

export type SensorType =
  | 'soil_moisture'
  | 'temperature'
  | 'planting_monitor'
  | 'spray_rate'
  | 'fertilizer_rate'
  | 'gps_tracker'
  | 'flow_sensor'
  | 'bar_sensor';

export interface Operation {
  operation_id: string;
  type: OperationType;
  machine_id: string;
  talhao_id: string;
  start: string;
  end: string;
  geojson_path?: FeatureCollection;
  metrics: Record<string, number | string>;
  operator?: string;
}

export type OperationType =
  | 'planting'
  | 'spraying'
  | 'fertilizing'
  | 'harvesting'
  | 'irrigation';

export interface Machine {
  machine_id: string;
  name: string;
  type: 'tractor' | 'sprayer' | 'harvester' | 'planter';
  status: 'active' | 'inactive' | 'maintenance';
  current_position?: {
    lat: number;
    lon: number;
  };
  speed?: number;
  heading?: number;
  operator?: string;
  hours_operation?: number;
}

export interface Alert {
  alert_id: string;
  type: 'urgent' | 'operation' | 'maintenance';
  title: string;
  message: string;
  timestamp: string;
  sensor_id?: string;
  machine_id?: string;
  talhao_id?: string;
  resolved: boolean;
}

export interface Farm {
  farm_id: string;
  name: string;
  owner: string;
  total_area_ha: number;
  talhoes: Talhao[];
}

export interface DashboardKPIs {
  area_planted_ha: number;
  area_sprayed_ha: number;
  area_fertilized_ha: number;
  sensors_online: number;
  sensors_total: number;
  avg_soil_moisture?: number;
  total_seeds_applied?: number;
  active_alerts: number;
}

export type LayerType =
  | 'planted'
  | 'sprayed'
  | 'fertilized'
  | 'irrigated'
  | 'harvested'
  | 'ndvi_low';

export interface MapLayer {
  id: LayerType;
  name: string;
  visible: boolean;
  opacity: number;
  color: string;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'agricultor_admin' | 'operador_maquina' | 'tecnico_terris' | 'visualizador';
  farm_id: string;
}
