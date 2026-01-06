import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  describe('Renderização', () => {
    it('deve renderizar com texto', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('deve aplicar variante primary por padrão', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary');
    });

    it('deve aplicar variante secondary', () => {
      render(<Button variant="secondary">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary');
    });

    it('deve aplicar variante success', () => {
      render(<Button variant="success">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-success');
    });

    it('deve aplicar variante warning', () => {
      render(<Button variant="warning">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-warning');
    });

    it('deve aplicar variante danger', () => {
      render(<Button variant="danger">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-danger');
    });

    it('deve aplicar variante ghost', () => {
      render(<Button variant="ghost">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent');
    });
  });

  describe('Tamanhos', () => {
    it('deve aplicar tamanho medium por padrão', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'px-4');
    });

    it('deve aplicar tamanho small', () => {
      render(<Button size="sm">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8', 'px-3', 'text-sm');
    });

    it('deve aplicar tamanho large', () => {
      render(<Button size="lg">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12', 'px-6', 'text-lg');
    });
  });

  describe('Interações', () => {
    it('deve chamar onClick quando clicado', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Button</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar onClick quando desabilitado', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} disabled>Button</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('deve estar desabilitado quando prop disabled é true', () => {
      render(<Button disabled>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Classes customizadas', () => {
    it('deve mesclar classes adicionais', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('bg-primary'); // classe padrão
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter role button', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('deve ser focável via teclado', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });
  });
});
