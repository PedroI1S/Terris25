import type { Talhao, SensorReading, Operation, Machine, Alert, DashboardKPIs, Farm } from '../types';

// Mock Talhões (Fields) - Região de Francisco Beltrão/PR
export const mockTalhoes: Talhao[] = [
  {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-52.713382, -26.199400],
          [-52.713994, -26.190408],
          [-52.701561, -26.190008],
          [-52.701346, -26.194661],
          [-52.708916, -26.194992],
          [-52.708747, -26.197712],
          [-52.710932, -26.197836],
          [-52.711224, -26.199369],
          [-52.713382, -26.199400],
        ],
      ],
    },
    properties: {
      id: 'talhao-123',
      name: 'Talhão 1',
      area_ha: 85.4,
      culture: 'Soja',
      created_at: '2025-08-10T09:00:00Z',
      sensors: ['sensor-789', 'sensor-456'],
      status: 'active',
      last_operation: 'planting',
    },
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-52.708886, -26.194992],
          [-52.701377, -26.194675],
          [-52.701131, -26.198858],
          [-52.708562, -26.199244],
          [-52.708886, -26.194992],
        ],
      ],
    },
    properties: {
      id: 'talhao-124',
      name: 'Talhão 2',
      area_ha: 42.3,
      culture: 'Milho',
      created_at: '2025-07-15T10:00:00Z',
      sensors: ['sensor-790', 'sensor-457'],
      status: 'active',
      last_operation: 'fertilizing',
    },
  },
];

// Mock Sensor Readings
export const mockSensorReadings: SensorReading[] = [
  {
    sensor_id: 'sensor-789',
    type: 'soil_moisture',
    talhao_id: 'talhao-123',
    timestamp: '2025-10-07T12:34:56Z',
    value: 23.5,
    unit: '%',
    geo: { lat: -26.195, lon: -52.707 },
    status: 'online',
    battery_level: 87,
    location: { lat: -26.195, lng: -52.707 },
  },
  {
    sensor_id: 'sensor-456',
    type: 'planting_monitor',
    talhao_id: 'talhao-123',
    timestamp: '2025-10-07T12:35:00Z',
    value: 28000,
    unit: 'seeds/ha',
    geo: { lat: -26.196, lon: -52.708 },
    status: 'online',
    battery_level: 92,
    location: { lat: -26.196, lng: -52.708 },
  },
  {
    sensor_id: 'sensor-790',
    type: 'temperature',
    talhao_id: 'talhao-124',
    timestamp: '2025-10-07T12:34:56Z',
    value: 22.8,
    unit: '°C',
    geo: { lat: -26.197, lon: -52.709 },
    status: 'online',
    battery_level: 78,
    location: { lat: -26.197, lng: -52.709 },
  },
  {
    sensor_id: 'sensor-791',
    type: 'spray_rate',
    talhao_id: 'talhao-124',
    timestamp: '2025-10-07T12:34:56Z',
    value: 150,
    unit: 'L/ha',
    geo: { lat: -26.198, lon: -52.71 },
    status: 'offline',
    battery_level: 15,
    location: { lat: -26.198, lng: -52.71 },
  },
];

// Mock Operations
export const mockOperations: Operation[] = [
  {
    operation_id: 'op-555',
    type: 'planting',
    machine_id: 'tractor-11',
    talhao_id: 'talhao-123',
    start: '2025-09-15T08:00:00Z',
    end: '2025-09-15T11:25:00Z',
    metrics: {
      seed_count: 350000,
      rate_per_ha: 28000,
    },
    operator: 'João Silva',
  },
  {
    operation_id: 'op-556',
    type: 'fertilizing',
    machine_id: 'sprayer-01',
    talhao_id: 'talhao-124',
    start: '2025-09-20T09:00:00Z',
    end: '2025-09-20T12:30:00Z',
    metrics: {
      fertilizer_applied_kg: 2500,
      rate_per_ha: 159,
    },
    operator: 'Maria Santos',
  },
  {
    operation_id: 'op-557',
    type: 'spraying',
    machine_id: 'sprayer-01',
    talhao_id: 'talhao-125',
    start: '2025-09-25T07:00:00Z',
    end: '2025-09-25T10:15:00Z',
    metrics: {
      spray_volume_L: 2835,
      rate_per_ha: 150,
    },
    operator: 'Carlos Oliveira',
  },
];

// Mock Machines
export const mockMachines: Machine[] = [
  {
    machine_id: 'tractor-11',
    name: 'Trator John Deere 7230R',
    type: 'tractor',
    status: 'active',
    current_position: { lat: -25.005, lon: -53.005 },
    speed: 12.5,
    heading: 45,
    operator: 'João Silva',
    hours_operation: 1245,
  },
  {
    machine_id: 'sprayer-01',
    name: 'Pulverizador Jacto Uniport 3030',
    type: 'sprayer',
    status: 'active',
    current_position: { lat: -25.02, lon: -53.02 },
    speed: 8.3,
    heading: 180,
    operator: 'Carlos Oliveira',
    hours_operation: 856,
  },
  {
    machine_id: 'harvester-01',
    name: 'Colheitadeira Case IH 9240',
    type: 'harvester',
    status: 'maintenance',
    hours_operation: 2340,
  },
];

// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    alert_id: 'alert-001',
    type: 'urgent',
    title: 'Sensor Offline',
    message: 'Sensor de taxa de aplicação (sensor-791) está offline há 2 horas.',
    timestamp: '2025-10-09T10:30:00Z',
    sensor_id: 'sensor-791',
    talhao_id: 'talhao-125',
    resolved: false,
  },
  {
    alert_id: 'alert-002',
    type: 'operation',
    title: 'Taxa de Plantio Abaixo do Esperado',
    message: 'Taxa de plantio no Talhão A está 15% abaixo do setpoint.',
    timestamp: '2025-10-09T09:15:00Z',
    talhao_id: 'talhao-123',
    resolved: false,
  },
  {
    alert_id: 'alert-003',
    type: 'maintenance',
    title: 'Manutenção Programada',
    message: 'Colheitadeira Case IH 9240 em manutenção preventiva.',
    timestamp: '2025-10-08T14:00:00Z',
    machine_id: 'harvester-01',
    resolved: false,
  },
];

// Mock Dashboard KPIs (valores calculados dinamicamente agora)
export const mockDashboardKPIs: DashboardKPIs = {
  area_planted_ha: 127.7, // Talhão 1 (85.4 ha) + Talhão 2 (42.3 ha)
  area_sprayed_ha: 85.4, // Apenas Talhão 1
  area_fertilized_ha: 127.7, // Ambos os talhões
  sensors_online: 3,
  sensors_total: 4,
  avg_soil_moisture: 23.5,
  total_seeds_applied: 35700000, // 23.9M (Talhão 1) + 11.8M (Talhão 2)
  active_alerts: 3,
};

// Mock Farm
export const mockFarm: Farm = {
  farm_id: 'farm-001',
  name: 'Fazenda São José',
  owner: 'Pedro Mariano',
  total_area_ha: 46.91,
  talhoes: mockTalhoes,
};
