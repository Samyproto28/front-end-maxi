/**
 * Tests para telegramaService
 * Valida serialización compleja de payload y casos edge según PRD sección 15.2
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import telegramaService from '../../src/services/telegramaService';
import api from '../../src/services/api';

// Mock de axios
vi.mock('../../src/services/api', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    }
  };
});

describe('telegramaService', () => {
  let mockApi;

  beforeEach(() => {
    mockApi = api;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ========== TESTS PARA MÉTODO CREATE ==========
  describe('create()', () => {
    it('debe enviar payload con estructura correcta según PRD 15.2', async () => {
      const payload = {
        mesa_id: 1,
        usuario: 'operador1',
        votos: [
          { lista_id: 1, votos_diputados: 120, votos_senadores: 90 },
          { lista_id: 2, votos_diputados: 100, votos_senadores: 110 }
        ],
        blancos: 8,
        nulos: 5,
        recurridos: 1
      };

      const expectedResponse = { id: 1, ...payload };
      mockApi.post.mockResolvedValueOnce({ data: { data: expectedResponse } });

      const result = await telegramaService.create(payload);

      expect(mockApi.post).toHaveBeenCalledWith('/telegramas', {
        mesa_id: 1,
        usuario: 'operador1',
        votos: [
          { lista_id: 1, votos_diputados: 120, votos_senadores: 90 },
          { lista_id: 2, votos_diputados: 100, votos_senadores: 110 }
        ],
        blancos: 8,
        nulos: 5,
        recurridos: 1
      });

      expect(result).toEqual(expectedResponse);
    });

    it('debe validar que votos es un array', async () => {
      const invalidPayload = {
        mesa_id: 1,
        usuario: 'operador1',
        votos: null,
        blancos: 8,
        nulos: 5,
        recurridos: 1
      };

      await expect(telegramaService.create(invalidPayload))
        .rejects.toThrow('Faltan campos requeridos: mesa_id, usuario, votos');
    });

    it('debe validar que el array de votos no esté vacío', async () => {
      const invalidPayload = {
        mesa_id: 1,
        usuario: 'operador1',
        votos: [],
        blancos: 8,
        nulos: 5,
        recurridos: 1
      };

      await expect(telegramaService.create(invalidPayload))
        .rejects.toThrow('El array de votos debe contener al menos un elemento');
    });

    it('debe convertir tipos de datos a integers correctamente', async () => {
      const payload = {
        mesa_id: '1', // String que debe convertirse
        usuario: 'operador1',
        votos: [
          { lista_id: '1', votos_diputados: '120', votos_senadores: '90' }
        ],
        blancos: '8',
        nulos: '5',
        recurridos: '1'
      };

      const expectedResponse = { id: 1 };
      mockApi.post.mockResolvedValueOnce({ data: { data: expectedResponse } });

      await telegramaService.create(payload);

      expect(mockApi.post).toHaveBeenCalledWith('/telegramas', {
        mesa_id: 1,
        usuario: 'operador1',
        votos: [
          { lista_id: 1, votos_diputados: 120, votos_senadores: 90 }
        ],
        blancos: 8,
        nulos: 5,
        recurridos: 1
      });
    });

    it('debe validar que mesa_id sea un entero positivo', async () => {
      const invalidPayload = {
        mesa_id: 0,
        usuario: 'operador1',
        votos: [{ lista_id: 1, votos_diputados: 120, votos_senadores: 90 }],
        blancos: 8,
        nulos: 5,
        recurridos: 1
      };

      await expect(telegramaService.create(invalidPayload))
        .rejects.toThrow('mesa_id debe ser un entero positivo');
    });

    it('debe validar que usuario no esté vacío', async () => {
      const invalidPayload = {
        mesa_id: 1,
        usuario: '',
        votos: [{ lista_id: 1, votos_diputados: 120, votos_senadores: 90 }],
        blancos: 8,
        nulos: 5,
        recurridos: 1
      };

      await expect(telegramaService.create(invalidPayload))
        .rejects.toThrow('usuario no puede estar vacío');
    });

    it('debe validar que blancos, nulos y recurridos no sean negativos', async () => {
      const invalidPayload = {
        mesa_id: 1,
        usuario: 'operador1',
        votos: [{ lista_id: 1, votos_diputados: 120, votos_senadores: 90 }],
        blancos: -1,
        nulos: 5,
        recurridos: 1
      };

      await expect(telegramaService.create(invalidPayload))
        .rejects.toThrow('blancos no puede ser negativo');
    });

    it('debe manejar error 422 del backend correctamente', async () => {
      const payload = {
        mesa_id: 1,
        usuario: 'operador1',
        votos: [{ lista_id: 1, votos_diputados: 120, votos_senadores: 90 }],
        blancos: 8,
        nulos: 5,
        recurridos: 1
      };

      const validationError = {
        response: {
          status: 422,
          data: {
            message: 'Los datos proporcionados no son válidos.',
            errors: {
              votos: ['La suma de votos (360) excede la cantidad de electores (350).']
            }
          }
        }
      };

      mockApi.post.mockRejectedValueOnce(validationError);

      await expect(telegramaService.create(payload)).rejects.toEqual({
        message: 'Los datos proporcionados no son válidos.',
        errors: {
          votos: ['La suma de votos (360) excede la cantidad de electores (350).']
        }
      });
    });

    it('debe retornar el payload mínimo válido con un solo voto', async () => {
      const payload = {
        mesa_id: 1,
        usuario: 'operador1',
        votos: [{ lista_id: 1, votos_diputados: 120, votos_senadores: 90 }],
        blancos: 8,
        nulos: 5,
        recurridos: 1
      };

      const expectedResponse = { id: 1 };
      mockApi.post.mockResolvedValueOnce({ data: { data: expectedResponse } });

      const result = await telegramaService.create(payload);

      expect(result).toEqual(expectedResponse);
    });

    it('debe manejar payload con múltiples votos', async () => {
      const payload = {
        mesa_id: 1,
        usuario: 'operador1',
        votos: [
          { lista_id: 1, votos_diputados: 120, votos_senadores: 90 },
          { lista_id: 2, votos_diputados: 100, votos_senadores: 110 },
          { lista_id: 3, votos_diputados: 80, votos_senadores: 85 }
        ],
        blancos: 8,
        nulos: 5,
        recurridos: 1
      };

      const expectedResponse = { id: 1 };
      mockApi.post.mockResolvedValueOnce({ data: { data: expectedResponse } });

      const result = await telegramaService.create(payload);

      expect(mockApi.post).toHaveBeenCalledWith('/telegramas', payload);
      expect(result).toEqual(expectedResponse);
    });
  });

  // ========== TESTS PARA MÉTODO GETBYMESA ==========
  describe('getByMesa()', () => {
    it('debe obtener todos los telegramas de una mesa sin filtros', async () => {
      const expectedTelegramas = [
        { id: 1, mesa_id: 123, usuario: 'operador1' },
        { id: 2, mesa_id: 123, usuario: 'operador2' }
      ];

      mockApi.get.mockResolvedValueOnce({ data: { data: expectedTelegramas } });

      const result = await telegramaService.getByMesa(123);

      expect(mockApi.get).toHaveBeenCalledWith('/telegramas', {
        params: { mesa_id: 123 }
      });

      expect(result).toEqual(expectedTelegramas);
    });

    it('debe filtrar por cargo correctamente', async () => {
      const expectedTelegramas = [
        { id: 1, mesa_id: 123, usuario: 'operador1' }
      ];

      mockApi.get.mockResolvedValueOnce({ data: { data: expectedTelegramas } });

      const result = await telegramaService.getByMesa(123, { cargo: 'DIPUTADOS' });

      expect(mockApi.get).toHaveBeenCalledWith('/telegramas', {
        params: { mesa_id: 123, cargo: 'DIPUTADOS' }
      });

      expect(result).toEqual(expectedTelegramas);
    });

    it('debe combinar múltiples filtros correctamente', async () => {
      const expectedTelegramas = [
        { id: 1, mesa_id: 123, usuario: 'operador1' }
      ];

      mockApi.get.mockResolvedValueOnce({ data: { data: expectedTelegramas } });

      const result = await telegramaService.getByMesa(123, {
        cargo: 'DIPUTADOS',
        fecha_desde: '2025-12-01',
        fecha_hasta: '2025-12-31',
        usuario: 'operador1'
      });

      expect(mockApi.get).toHaveBeenCalledWith('/telegramas', {
        params: {
          mesa_id: 123,
          cargo: 'DIPUTADOS',
          fecha_desde: '2025-12-01',
          fecha_hasta: '2025-12-31',
          usuario: 'operador1'
        }
      });

      expect(result).toEqual(expectedTelegramas);
    });
  });

  // ========== TESTS PARA MÉTODOS CRUD BÁSICOS ==========
  describe('getAll()', () => {
    it('debe obtener todos los telegramas con parámetros', async () => {
      const expectedTelegramas = [{ id: 1 }];
      mockApi.get.mockResolvedValueOnce({ data: { data: expectedTelegramas } });

      const result = await telegramaService.getAll({ estado: 'VALIDADO' });

      expect(mockApi.get).toHaveBeenCalledWith('/telegramas', {
        params: { estado: 'VALIDADO' }
      });

      expect(result).toEqual(expectedTelegramas);
    });
  });

  describe('getById()', () => {
    it('debe obtener telegrama por ID', async () => {
      const expectedTelegrama = { id: 1, mesa_id: 123 };
      mockApi.get.mockResolvedValueOnce({ data: { data: expectedTelegrama } });

      const result = await telegramaService.getById(1);

      expect(mockApi.get).toHaveBeenCalledWith('/telegramas/1');
      expect(result).toEqual(expectedTelegrama);
    });
  });

  describe('update()', () => {
    it('debe actualizar telegrama existente', async () => {
      const updateData = { usuario: 'nuevo_operador' };
      const expectedResponse = { id: 1, ...updateData };

      mockApi.put.mockResolvedValueOnce({ data: { data: expectedResponse } });

      const result = await telegramaService.update(1, updateData);

      expect(mockApi.put).toHaveBeenCalledWith('/telegramas/1', updateData);
      expect(result).toEqual(expectedResponse);
    });

    it('debe manejar error 422 en update', async () => {
      const updateData = { usuario: 'nuevo_operador' };

      const validationError = {
        response: {
          status: 422,
          data: {
            message: 'Error de validación',
            errors: {
              usuario: ['El usuario ya existe']
            }
          }
        }
      };

      mockApi.put.mockRejectedValueOnce(validationError);

      await expect(telegramaService.update(1, updateData)).rejects.toEqual({
        message: 'Error de validación',
        errors: {
          usuario: ['El usuario ya existe']
        }
      });
    });
  });

  describe('delete()', () => {
    it('debe eliminar telegrama', async () => {
      const expectedResponse = { id: 1, deleted: true };
      mockApi.delete.mockResolvedValueOnce({ data: { data: expectedResponse } });

      const result = await telegramaService.delete(1);

      expect(mockApi.delete).toHaveBeenCalledWith('/telegramas/1');
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getByEstado()', () => {
    it('debe filtrar por estado', async () => {
      const expectedTelegramas = [{ id: 1, estado: 'VALIDADO' }];
      mockApi.get.mockResolvedValueOnce({ data: { data: expectedTelegramas } });

      const result = await telegramaService.getByEstado('VALIDADO');

      expect(mockApi.get).toHaveBeenCalledWith('/telegramas', {
        params: { estado: 'VALIDADO' }
      });

      expect(result).toEqual(expectedTelegramas);
    });
  });

  describe('validar()', () => {
    it('debe validar telegrama', async () => {
      const expectedResponse = { id: 1, estado: 'VALIDADO' };
      mockApi.put.mockResolvedValueOnce({ data: { data: expectedResponse } });

      const result = await telegramaService.validar(1, 'Observaciones de validación');

      expect(mockApi.put).toHaveBeenCalledWith('/telegramas/1/validar', {
        observaciones: 'Observaciones de validación'
      });

      expect(result).toEqual(expectedResponse);
    });
  });

  describe('rechazar()', () => {
    it('debe rechazar telegrama', async () => {
      const expectedResponse = { id: 1, estado: 'RECHAZADO' };
      mockApi.put.mockResolvedValueOnce({ data: { data: expectedResponse } });

      const result = await telegramaService.rechazar(1, 'Motivo del rechazo');

      expect(mockApi.put).toHaveBeenCalledWith('/telegramas/1/rechazar', {
        observaciones: 'Motivo del rechazo'
      });

      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getEstadisticas()', () => {
    it('debe obtener estadísticas', async () => {
      const expectedStats = { total: 100, validados: 80 };
      mockApi.get.mockResolvedValueOnce({ data: { data: expectedStats } });

      const result = await telegramaService.getEstadisticas();

      expect(mockApi.get).toHaveBeenCalledWith('/telegramas/estadisticas');
      expect(result).toEqual(expectedStats);
    });
  });
});
