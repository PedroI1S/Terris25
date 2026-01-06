import type { Meta, StoryObj } from '@storybook/react';
import { TalhaoCard } from './TalhaoCard';
import { mockTalhoes } from '../../mocks/data';

const meta = {
  title: 'Molecules/TalhaoCard',
  component: TalhaoCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TalhaoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    talhao: {
      ...mockTalhoes[0],
      properties: {
        ...mockTalhoes[0].properties,
        status: 'active',
      },
    },
    onClick: () => console.log('Talhão clicked'),
  },
};

export const Inactive: Story = {
  args: {
    talhao: {
      ...mockTalhoes[1],
      properties: {
        ...mockTalhoes[1].properties,
        status: 'inactive',
      },
    },
    onClick: () => console.log('Talhão clicked'),
  },
};

export const Maintenance: Story = {
  args: {
    talhao: {
      ...mockTalhoes[2],
      properties: {
        ...mockTalhoes[2].properties,
        status: 'maintenance',
      },
    },
    onClick: () => console.log('Talhão clicked'),
  },
};

export const AllStatuses: Story = {
  args: { talhao: mockTalhoes[0] },
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <TalhaoCard
        talhao={{
          ...mockTalhoes[0],
          properties: { ...mockTalhoes[0].properties, status: 'active' },
        }}
        onClick={() => console.log('Active clicked')}
      />
      <TalhaoCard
        talhao={{
          ...mockTalhoes[1],
          properties: { ...mockTalhoes[1].properties, status: 'inactive' },
        }}
        onClick={() => console.log('Inactive clicked')}
      />
      <TalhaoCard
        talhao={{
          ...mockTalhoes[2],
          properties: { ...mockTalhoes[2].properties, status: 'maintenance' },
        }}
        onClick={() => console.log('Maintenance clicked')}
      />
    </div>
  ),
};

export const LargeArea: Story = {
  args: {
    talhao: {
      ...mockTalhoes[0],
      properties: {
        ...mockTalhoes[0].properties,
        area_ha: 125.75,
        name: 'Talhão Grande 001',
        culture: 'Milho',
        last_operation: '2024-12-10T14:30:00Z',
      },
    },
  },
};

export const SmallArea: Story = {
  args: {
    talhao: {
      ...mockTalhoes[0],
      properties: {
        ...mockTalhoes[0].properties,
        area_ha: 8.5,
        name: 'Talhão Pequeno 005',
        culture: 'Hortaliças',
        last_operation: '2024-12-18T08:00:00Z',
      },
    },
  },
};

export const NoRecentOperation: Story = {
  args: {
    talhao: {
      ...mockTalhoes[0],
      properties: {
        ...mockTalhoes[0].properties,
        last_operation: undefined,
      },
    },
  },
};
