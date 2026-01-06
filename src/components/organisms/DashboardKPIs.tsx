import { Card, CardContent, CardHeader, CardTitle } from '../atoms/Card';
import type { DashboardKPIs } from '../../types';
import { formatArea } from '../../lib/utils';
import { 
  Sprout, 
  Droplet, 
  Leaf, 
  Wifi, 
  Droplets, 
  Wheat, 
  AlertTriangle 
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

function KPICard({ title, value, icon: Icon, trend, className }: KPICardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-neutral-mid">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-neutral-dark">{value}</div>
        {trend && (
          <p className={`text-xs ${trend.isPositive ? 'text-success' : 'text-danger'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}% em relação ao mês anterior
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardKPIsProps {
  data: DashboardKPIs;
}

export function DashboardKPIsGrid({ data }: DashboardKPIsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Área Plantada"
        value={formatArea(data.area_planted_ha)}
        icon={Sprout}
        trend={{ value: 12, isPositive: true }}
      />
      
      <KPICard
        title="Área Pulverizada"
        value={formatArea(data.area_sprayed_ha)}
        icon={Droplet}
        trend={{ value: 8, isPositive: true }}
      />
      
      <KPICard
        title="Área Adubada"
        value={formatArea(data.area_fertilized_ha)}
        icon={Leaf}
        trend={{ value: 15, isPositive: true }}
      />
      
      <KPICard
        title="Sensores Online"
        value={`${data.sensors_online}/${data.sensors_total}`}
        icon={Wifi}
        className={data.sensors_online < data.sensors_total ? 'border-warning' : ''}
      />
      
      {data.avg_soil_moisture !== undefined && (
        <KPICard
          title="Umidade Média do Solo"
          value={`${data.avg_soil_moisture.toFixed(1)}%`}
          icon={Droplets}
        />
      )}
      
      {data.total_seeds_applied !== undefined && (
        <KPICard
          title="Sementes Aplicadas"
          value={data.total_seeds_applied.toLocaleString('pt-BR')}
          icon={Wheat}
        />
      )}
      
      <KPICard
        title="Alertas Ativos"
        value={data.active_alerts}
        icon={AlertTriangle}
        className={data.active_alerts > 0 ? 'border-danger' : 'border-success'}
      />
    </div>
  );
}
