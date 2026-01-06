import { Card, CardContent, CardHeader, CardTitle } from '../atoms/Card';
import type { Alert } from '../../types';
import { formatDateTime } from '../../lib/utils';
import { AlertTriangle, Bell, Wrench, CheckCircle2 } from 'lucide-react';
import { Button } from '../atoms/Button';

interface AlertItemProps {
  alert: Alert;
  onResolve?: (alertId: string) => void;
}

function AlertItem({ alert, onResolve }: AlertItemProps) {
  const typeIcons = {
    urgent: <AlertTriangle className="h-5 w-5 text-danger" />,
    operation: <Bell className="h-5 w-5 text-warning" />,
    maintenance: <Wrench className="h-5 w-5 text-primary" />,
  };
  
  const typeColors = {
    urgent: 'bg-danger/10 border-l-danger',
    operation: 'bg-warning/10 border-l-warning',
    maintenance: 'bg-primary/10 border-l-primary',
  };
  
  const typeLabels = {
    urgent: 'Urgente',
    operation: 'Operação',
    maintenance: 'Manutenção',
  };
  
  return (
    <div className={`p-4 rounded-lg border-l-4 ${typeColors[alert.type]} ${alert.resolved ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          {typeIcons[alert.type]}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-neutral-dark">{alert.title}</h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-mid/20 text-neutral-dark">
                {typeLabels[alert.type]}
              </span>
            </div>
            <p className="text-sm text-neutral-mid mb-2">{alert.message}</p>
            <div className="text-xs text-neutral-mid">
              {formatDateTime(alert.timestamp)}
            </div>
          </div>
        </div>
        {!alert.resolved && onResolve && (
          <Button
            size="sm"
            variant="success"
            onClick={() => onResolve(alert.alert_id)}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Resolver
          </Button>
        )}
      </div>
    </div>
  );
}

interface AlertsPanelProps {
  alerts: Alert[];
  filterType?: 'all' | 'urgent' | 'operation' | 'maintenance';
  onResolve?: (alertId: string) => void;
}

export function AlertsPanel({ alerts, filterType = 'all', onResolve }: AlertsPanelProps) {
  const filteredAlerts = filterType === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === filterType);
  
  const activeAlerts = filteredAlerts.filter(alert => !alert.resolved);
  const resolvedAlerts = filteredAlerts.filter(alert => alert.resolved);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Alertas
          {activeAlerts.length > 0 && (
            <span className="bg-danger text-white text-xs px-2 py-0.5 rounded-full">
              {activeAlerts.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeAlerts.length === 0 && resolvedAlerts.length === 0 && (
            <p className="text-sm text-neutral-mid text-center py-4">
              Nenhum alerta no momento
            </p>
          )}
          
          {activeAlerts.map((alert) => (
            <AlertItem key={alert.alert_id} alert={alert} onResolve={onResolve} />
          ))}
          
          {resolvedAlerts.length > 0 && (
            <>
              <div className="border-t border-gray-200 my-4" />
              <h5 className="text-sm font-semibold text-neutral-mid mb-2">Resolvidos</h5>
              {resolvedAlerts.map((alert) => (
                <AlertItem key={alert.alert_id} alert={alert} />
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
