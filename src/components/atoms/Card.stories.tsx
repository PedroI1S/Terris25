import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Sprout, Droplet, Activity } from 'lucide-react';

const meta = {
  title: 'Atoms/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'max-w-md',
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-500">
            Este é um exemplo de card básico com título e conteúdo.
          </p>
        </CardContent>
      </>
    ),
  },
};

export const WithIcon: Story = {
  args: {
    className: 'max-w-md',
    children: (
      <>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-primary-600" />
            <CardTitle>Talhão 001-A</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Área:</span>
              <span className="font-medium">45.3 ha</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Cultura:</span>
              <span className="font-medium">Soja</span>
            </div>
          </div>
        </CardContent>
      </>
    ),
  },
};

export const MultipleCards: Story = {
  args: { children: null },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-success-600" />
            <CardTitle className="text-base">Área Cultivada</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">124.5 ha</p>
          <p className="text-xs text-success-600 mt-1">↑ 5% este mês</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-primary-600" />
            <CardTitle className="text-base">Consumo de Água</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">1,234 m³</p>
          <p className="text-xs text-neutral-500 mt-1">Últimos 7 dias</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-warning-600" />
            <CardTitle className="text-base">Operações Ativas</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">3</p>
          <p className="text-xs text-neutral-500 mt-1">Em andamento</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de múltiplos cards em grid layout.',
      },
    },
  },
};

export const ComplexContent: Story = {
  args: {
    className: 'max-w-md',
    children: (
      <>
        <CardHeader>
          <CardTitle>Status da Fazenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Área Cultivada</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-success-500 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Sensores Ativos</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Máquinas Operando</span>
                <span className="font-medium">60%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-warning-500 h-2 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </>
    ),
  },
};
