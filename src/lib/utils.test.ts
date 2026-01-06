import { describe, it, expect } from 'vitest';
import { cn, formatArea, formatDate, formatDateTime } from '../lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('deve mesclar classes sem conflito', () => {
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toBe('py-1 px-4');
    });

    it('deve lidar com classes condicionais', () => {
      const result = cn('base-class', false && 'hidden', true && 'visible');
      expect(result).toContain('base-class');
      expect(result).toContain('visible');
      expect(result).not.toContain('hidden');
    });

    it('deve lidar com undefined e null', () => {
      const result = cn('class1', undefined, null, 'class2');
      expect(result).toBe('class1 class2');
    });
  });

  describe('formatArea', () => {
    it('deve formatar área com 2 casas decimais', () => {
      expect(formatArea(45.3)).toBe('45.30 ha');
    });

    it('deve formatar área com arredondamento', () => {
      expect(formatArea(45.678)).toBe('45.68 ha');
    });

    it('deve formatar área com 0', () => {
      expect(formatArea(0)).toBe('0.00 ha');
    });

    it('deve formatar área grande', () => {
      expect(formatArea(1234.5)).toBe('1234.50 ha');
    });

    it('deve formatar área muito pequena', () => {
      expect(formatArea(0.12345)).toBe('0.12 ha');
    });
  });

  describe('formatDate', () => {
    it('deve formatar data no formato pt-BR', () => {
      const result = formatDate('2024-12-15T10:30:00Z');
      // O formato exato pode variar dependendo da timezone
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('deve formatar data com horário', () => {
      const result = formatDate('2024-01-01T00:00:00Z');
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });

  describe('formatDateTime', () => {
    it('deve formatar data e hora no formato pt-BR', () => {
      const result = formatDateTime('2024-12-15T10:30:00Z');
      // O formato exato pode variar dependendo da timezone
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('deve incluir vírgula entre data e hora', () => {
      const result = formatDateTime('2024-01-01T12:00:00Z');
      expect(result).toContain(',');
    });
  });
});
