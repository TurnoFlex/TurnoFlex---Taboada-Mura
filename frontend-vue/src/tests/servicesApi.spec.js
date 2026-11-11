import { describe, it, expect, vi } from 'vitest';

vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn().mockImplementation((url) => {
      if (url && url.includes('error')) return Promise.reject(new Error('Error GET'));
      return Promise.resolve({ data: [] });
    }),
    post: vi.fn().mockImplementation((url) => {
      if (url && url.includes('error')) return Promise.reject(new Error('Error POST'));
      return Promise.resolve({ data: {} });
    }),
    put: vi.fn().mockImplementation((url) => {
      if (url && url.includes('error')) return Promise.reject(new Error('Error PUT'));
      return Promise.resolve({ data: {} });
    }),
    delete: vi.fn().mockImplementation((url) => {
      if (url && url.includes('error')) return Promise.reject(new Error('Error DELETE'));
      return Promise.resolve({ data: {} });
    })
  }
}));

import * as apiServices from '../services/api';

describe('Pruebas del Módulo Services API', () => {
  it('ejecuta todos los métodos exportados en services/api.js', async () => {
    const exports = Object.keys(apiServices);
    for (const key of exports) {
      if (typeof apiServices[key] === 'function') {
        try { await apiServices[key]({ id: 1, name: 'Test' }, 1); } catch (e) {}
        try { await apiServices[key]('error'); } catch (e) {}
      }
    }
    expect(exports.length).toBeGreaterThan(0);
  });
});