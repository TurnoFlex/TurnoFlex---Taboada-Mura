import { describe, it, expect } from 'vitest';
import { formatCurrency, FALLBACK_SERVICES, TIME_SLOTS } from '../utils/constants';

describe('Pruebas de Utilitarios y Constantes', () => {
  it('formatea montos numéricos correctamente', () => {
    expect(formatCurrency(8000)).toBe('8.000');
    expect(formatCurrency(0)).toBe('0');
    expect(formatCurrency(null)).toBe('0');
    expect(formatCurrency(undefined)).toBe('0');
  });

  it('valida la constante de servicios fallback y horarios', () => {
    expect(FALLBACK_SERVICES.length).toBeGreaterThan(0);
    expect(TIME_SLOTS).toHaveLength(22);
  });
});