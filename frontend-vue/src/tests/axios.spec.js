import { describe, it, expect, beforeEach, vi } from 'vitest';
import api from '../api/axios';

describe('Pruebas de la configuración de Axios', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('asigna la URL base correcta', () => {
    expect(api.defaults.baseURL).toContain('/api/v1');
  });

  it('adjunta el token Authorization si existe en localStorage', async () => {
    localStorage.setItem('token', 'fake-jwt-token');
    
    // Simular ejecución del interceptor de petición
    const config = { headers: {} };
    const interceptor = api.interceptors.request.handlers[0].fulfilled;
    const resultConfig = interceptor(config);

    expect(resultConfig.headers.Authorization).toBe('Bearer fake-jwt-token');
  });

  it('no adjunta la cabecera Authorization si no hay token', () => {
    const config = { headers: {} };
    const interceptor = api.interceptors.request.handlers[0].fulfilled;
    const resultConfig = interceptor(config);

    expect(resultConfig.headers.Authorization).toBeUndefined();
  });
});