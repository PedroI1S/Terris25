import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Sprout, AlertTriangle, CheckCircle } from 'lucide-react';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Stories básicas
export const Primary: Story = {
  args: {
    children: 'Button Primary',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Button Secondary',
    variant: 'secondary',
  },
};

export const Success: Story = {
  args: {
    children: 'Button Success',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Button Warning',
    variant: 'warning',
  },
};

export const Danger: Story = {
  args: {
    children: 'Button Danger',
    variant: 'danger',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Button Ghost',
    variant: 'ghost',
  },
};

// Tamanhos
export const Small: Story = {
  args: {
    children: 'Button Small',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    children: 'Button Medium',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    children: 'Button Large',
    size: 'lg',
  },
};

// Estados
export const Disabled: Story = {
  args: {
    children: 'Button Disabled',
    disabled: true,
  },
};

// Com ícones
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Sprout className="w-5 h-5" />
        <span>Nova Operação</span>
      </>
    ),
  },
  render: (args) => (
    <Button {...args} className="flex items-center gap-2" />
  ),
};

export const IconOnly: Story = {
  args: {
    children: <CheckCircle className="w-5 h-5" />,
    variant: 'success',
  },
};

// Composição de variantes
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="success">Success</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// Exemplo real
export const RealWorldExample: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button variant="primary">
        <Sprout className="w-4 h-4" />
        <span>Iniciar Operação</span>
      </Button>
      <Button variant="warning">
        <AlertTriangle className="w-4 h-4" />
        <span>Alertas</span>
      </Button>
      <Button variant="ghost" size="sm">
        Cancelar
      </Button>
    </div>
  ),
};
