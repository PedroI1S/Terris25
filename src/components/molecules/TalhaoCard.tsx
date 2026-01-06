import { Card, CardContent, CardHeader, CardTitle } from '../atoms/Card';
import { formatArea, formatDate } from '../../lib/utils';
import type { Talhao } from '../../types';
import { MapPin, Activity } from 'lucide-react';

interface TalhaoCardProps {
  talhao: Talhao;
  onClick?: () => void;
}

export function TalhaoCard({ talhao, onClick }: TalhaoCardProps) {
  const { name, area_ha, culture, status, last_operation, created_at } = talhao.properties;
  
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
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle>{name}</CardTitle>
          </div>
          {status && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full border ${statusColors[status]}`}>
              {statusLabels[status]}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-mid">Área:</span>
            <span className="font-medium text-neutral-dark">{formatArea(area_ha)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-mid">Cultura:</span>
            <span className="font-medium text-neutral-dark">{culture}</span>
          </div>
          {last_operation && (
            <div className="flex items-center gap-2 text-sm pt-2 border-t border-gray-100">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-neutral-mid">Última operação:</span>
              <span className="font-medium text-neutral-dark capitalize">{last_operation}</span>
            </div>
          )}
          <div className="text-xs text-neutral-mid pt-1">
            Criado em: {formatDate(created_at)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
