import { http, HttpResponse } from 'msw';
import {
  mockTalhoes,
  mockSensorReadings,
  mockOperations,
  mockMachines,
  mockAlerts,
  mockDashboardKPIs,
} from './data';

export const handlers = [
  // GET /api/v1/farms/{farmId}/talhoes
  http.get('/api/v1/farms/:farmId/talhoes', () => {
    return HttpResponse.json({
      type: 'FeatureCollection',
      features: mockTalhoes,
    });
  }),

  // GET /api/v1/talhoes/{id}
  http.get('/api/v1/talhoes/:id', ({ params }) => {
    const { id } = params;
    const talhao = mockTalhoes.find(t => t.properties.id === id);
    
    if (!talhao) {
      return new HttpResponse(null, { status: 404 });
    }
    
    const operations = mockOperations.filter(op => op.talhao_id === id);
    const sensors = mockSensorReadings.filter(s => s.talhao_id === id);
    
    return HttpResponse.json({
      talhao,
      operations,
      sensors,
    });
  }),

  // GET /api/v1/sensors/{sensorId}/telemetry
  http.get('/api/v1/sensors/:sensorId/telemetry', ({ params, request }) => {
    const { sensorId } = params;
    const url = new URL(request.url);
    const start = url.searchParams.get('start');
    const end = url.searchParams.get('end');
    
    // Generate mock time series data
    const readings = Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (24 - i) * 3600000).toISOString(),
      value: Math.random() * 30 + 10,
    }));
    
    return HttpResponse.json({
      sensor_id: sensorId,
      start,
      end,
      readings,
    });
  }),

  // GET /api/v1/machines
  http.get('/api/v1/machines', () => {
    return HttpResponse.json(mockMachines);
  }),

  // GET /api/v1/machines/{machineId}
  http.get('/api/v1/machines/:machineId', ({ params }) => {
    const { machineId } = params;
    const machine = mockMachines.find(m => m.machine_id === machineId);
    
    if (!machine) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(machine);
  }),

  // GET /api/v1/alerts
  http.get('/api/v1/alerts', () => {
    return HttpResponse.json(mockAlerts);
  }),

  // POST /api/v1/alerts/{alertId}/resolve
  http.post('/api/v1/alerts/:alertId/resolve', ({ params }) => {
    const { alertId } = params;
    return HttpResponse.json({
      alert_id: alertId,
      resolved: true,
      resolved_at: new Date().toISOString(),
    });
  }),

  // GET /api/v1/dashboard/kpis
  http.get('/api/v1/dashboard/kpis', () => {
    return HttpResponse.json(mockDashboardKPIs);
  }),

  // POST /api/v1/exports/map
  http.post('/api/v1/exports/map', async ({ request }) => {
    const body = await request.json() as { format?: 'pdf' | 'png'; layers?: string[]; bbox?: number[]; timeRange?: string[] };
    const format = body?.format || 'pdf';
    
    // Simulate PDF generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return HttpResponse.json({
      export_id: `export-${Date.now()}`,
      format,
      url: `/exports/map-export-${Date.now()}.${format}`,
      created_at: new Date().toISOString(),
    });
  }),

  // GET /api/v1/operations
  http.get('/api/v1/operations', () => {
    return HttpResponse.json(mockOperations);
  }),
];
