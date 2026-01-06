import { X, Calendar, Sprout, Droplets, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../atoms/Card';
import { Button } from '../atoms/Button';

interface Operation {
  id: string;
  talhaoId: string;
  talhaoName: string;
  type: 'planting' | 'spraying' | 'irrigation' | 'fertilizing' | 'harvesting';
  date: string;
  culture: string;
  area: number;
  details?: {
    seedsPlanted?: number;
    yield?: number;
    product?: string;
    notes?: string;
  };
}

interface OperationsHistoryModalProps {
  talhaoName: string;
  operations: Operation[];
  onClose: () => void;
}

const getOperationIcon = (type: string) => {
  switch (type) {
    case 'planting':
      return <Sprout className="h-4 w-4 text-green-600" />;
    case 'spraying':
      return <Sparkles className="h-4 w-4 text-purple-600" />;
    case 'irrigation':
      return <Droplets className="h-4 w-4 text-blue-600" />;
    case 'fertilizing':
      return <TrendingUp className="h-4 w-4 text-orange-600" />;
    case 'harvesting':
      return <Sprout className="h-4 w-4 text-amber-600" />;
    default:
      return <Calendar className="h-4 w-4 text-neutral-600" />;
  }
};

const getOperationColor = (type: string) => {
  switch (type) {
    case 'planting':
      return 'bg-green-50 border-green-200';
    case 'spraying':
      return 'bg-purple-50 border-purple-200';
    case 'irrigation':
      return 'bg-blue-50 border-blue-200';
    case 'fertilizing':
      return 'bg-orange-50 border-orange-200';
    case 'harvesting':
      return 'bg-amber-50 border-amber-200';
    default:
      return 'bg-neutral-50 border-neutral-200';
  }
};

const getOperationLabel = (type: string) => {
  switch (type) {
    case 'planting':
      return 'Plantio';
    case 'spraying':
      return 'Pulverização';
    case 'irrigation':
      return 'Irrigação';
    case 'fertilizing':
      return 'Adubação';
    case 'harvesting':
      return 'Colheita';
    default:
      return type;
  }
};

export function OperationsHistoryModal({ talhaoName, operations, onClose }: OperationsHistoryModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-start justify-between border-b">
          <div>
            <CardTitle className="text-xl">Histórico de Operações</CardTitle>
            <p className="text-sm text-neutral-600 mt-1">{talhaoName}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="pt-6 overflow-y-auto flex-1">
          {operations.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-600">Nenhuma operação registrada ainda</p>
            </div>
          ) : (
            <div className="space-y-3">
              {operations.map((operation) => (
                <div
                  key={operation.id}
                  className={`rounded-lg border p-4 ${getOperationColor(operation.type)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getOperationIcon(operation.type)}
                      <span className="font-semibold text-neutral-900">
                        {getOperationLabel(operation.type)}
                      </span>
                    </div>
                    <span className="text-sm text-neutral-600">
                      {new Date(operation.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Cultura:</span>
                      <span className="font-medium text-neutral-900">{operation.culture}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Área:</span>
                      <span className="font-medium text-neutral-900">{operation.area} ha</span>
                    </div>

                    {operation.details?.seedsPlanted && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Sementes:</span>
                        <span className="font-medium text-neutral-900">
                          {new Intl.NumberFormat('pt-BR').format(operation.details.seedsPlanted)}
                        </span>
                      </div>
                    )}

                    {operation.details?.yield && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Produção:</span>
                        <span className="font-medium text-neutral-900">
                          {new Intl.NumberFormat('pt-BR').format(operation.details.yield)} kg
                        </span>
                      </div>
                    )}

                    {operation.details?.product && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Produto:</span>
                        <span className="font-medium text-neutral-900">{operation.details.product}</span>
                      </div>
                    )}

                    {operation.details?.notes && (
                      <div className="mt-2 pt-2 border-t border-neutral-200">
                        <p className="text-xs text-neutral-700 italic">{operation.details.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
