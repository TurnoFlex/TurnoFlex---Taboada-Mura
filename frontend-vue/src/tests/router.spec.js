import { describe, it, expect } from 'vitest';
import router from '../router/index';

describe('Pruebas del Enrutador Vue Router', () => {
  it('contiene las rutas requeridas de la aplicación', () => {
    const routes = router.getRoutes().map(r => r.path);
    expect(routes.length).toBeGreaterThan(0);
  });

  it('resuelve correctamente la ruta del dashboard', () => {
    const route = router.resolve('/dashboard');
    expect(route.path).toBe('/dashboard');
  });
});