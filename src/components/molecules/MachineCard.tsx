import { Card, CardContent, CardHeader, CardTitle } from '../atoms/Card';
import type { Machine } from '../../types';
import { Tractor, Gauge, User, Clock } from 'lucide-react';

interface MachineCardProps {
  machine: Machine;
  onClick?: () => void;
}

export function MachineCard({ machine, onClick }: MachineCardProps) {
  const statusColors = {
    active: 'bg-success/10 text-success border-success/20',
    inactive: 'bg-neutral-mid/10 text-neutral-mid border-neutral-mid/20',
    maintenance: 'bg-warning/10 text-warning border-warning/20',
  };
  
  const statusLabels = {
    active: 'Ativo',
    inactive: 'Inativo',
    maintenance: 'Manutenção',
  };
  
  const typeLabels = {
    tractor: 'Trator',
    sprayer: 'Pulverizador',
    harvester: 'Colheitadeira',
    planter: 'Plantadeira',
  };
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Tractor className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{machine.name}</CardTitle>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full border ${statusColors[machine.status]}`}>
            {statusLabels[machine.status]}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-mid">Tipo:</span>
            <span className="font-medium text-neutral-dark">{typeLabels[machine.type]}</span>
          </div>
          
          {machine.operator && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-neutral-mid" />
              <span className="text-neutral-mid">Operador:</span>
              <span className="font-medium text-neutral-dark">{machine.operator}</span>
            </div>
          )}
          
          {machine.speed && (
            <div className="flex items-center gap-2 text-sm">
              <Gauge className="h-4 w-4 text-neutral-mid" />
              <span className="text-neutral-mid">Velocidade:</span>
              <span className="font-medium text-neutral-dark">{machine.speed} km/h</span>
            </div>
          )}
          
          {machine.hours_operation && (
            <div className="flex items-center gap-2 text-sm pt-2 border-t border-gray-100">
              <Clock className="h-4 w-4 text-neutral-mid" />
              <span className="text-neutral-mid">Horas de operação:</span>
              <span className="font-medium text-neutral-dark">{machine.hours_operation}h</span>
            </div>
          )}
          
          {machine.current_position && (
            <div className="text-xs text-neutral-mid pt-1">
              Posição: {machine.current_position.lat.toFixed(4)}, {machine.current_position.lon.toFixed(4)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
