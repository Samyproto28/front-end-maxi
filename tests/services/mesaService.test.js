/**
 * Tests para mesaService
 * Valida métodos CRUD y filtrado
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import mesaService from '../../src/services/mesaService';
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

describe('mesaService', () => {
  let mockApi;

  beforeEach(() => {
    mockApi = api;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ========== TESTS PARA MÉTODOS CRUD ==========
  describe('getAll()', () => {
    it('debe obtener todas las mesas', async () => {
      const expectedMesas = [
        { id: 1, numero: 1, provincia_id: 1 },
        { id: 2, numero: 2, provincia_id: 1 }
      ];

      mockApi.get.mockResolvedValueOnce({ data: { data: expectedMesas } });

      const result = await mesaService.getAll();

      expect(mockApi.get).toHaveBeenCalledWith('/mesas');
      expect(result).toEqual(expectedMesas);
    });
  });

  describe('getById()', () => {
    it('debe obtener mesa por ID', async () => {
      const expectedMesa = { id: 1, numero: 1, provincia_id: 1 };
      mockApi.get.mockResolvedValueOnce({ data: { data: expectedMesa } });

      const result = await mesaService.getById(1);

      expect(mockApi.get).toHaveBeenCalledWith('/mesas/1');
      expect(result).toEqual(expectedMesa);
    });
  });

  describe('getByProvincia()', () => {
    it('debe filtrar mesas por provincia_id', async () => {
      const expectedMesas = [
        { id: 1, numero: 1, provincia_id: 1 },
        { id: 2, numero: 2, provincia_id: 1 }
      ];

      mockApi.get.mockResolvedValueOnce({ data: { data: expectedMesas } });

      const result = await mesaService.getByProvincia(1);

      expect(mockApi.get).toHaveBeenCalledWith('/provincias/1/mesas');
      expect(result).toEqual(expectedMesas);
    });
  });

  describe('create()', () => {
    it('debe crear nueva mesa', async () => {
      const mesaData = {
        numero: 10,
        escuela: 'Escuela Test',
        direccion: 'Calle Test 123',
        provincia_id: 1,
        electores: 350,
        estado: 'ABIERTA'
      };

      const expectedResponse = { id: 10, ...mesaData };
      mockApi.post.mockResolvedValueOnce({ data: { data: expectedResponse } });

      const result = await mesaService.create(mesaData);

      expect(mockApi.post).toHaveBeenCalledWith('/mesas', mesaData);
      expect(result).toEqual(expectedResponse);
    });

    it('debe manejar error 422 del backend', async () => {
      const mesaData = {
        numero: 10,
        escuela: 'Escuela Test',
        provincia_id: 1,
        electores: 350
      };

      const validationError = {
        response: {
          status: 422,
          data: {
            message: 'Los datos proporcionados no son válidos.',
            errors: {
              numero: ['El número de mesa ya existe'],
              direccion: ['La dirección es requerida']
            }
          }
        }
      };

      mockApi.post.mockRejectedValueOnce(validationError);

      await expect(mesaService.create(mesaData)).rejects.toEqual({
        message: 'Los datos proporcionados no son válidos.',
        errors: {
          numero: ['El número de mesa ya existe'],
          direccion: ['La dirección es requerida']
        }
      });
    });
  });

  describe('update()', () => {
    it('debe actualizar mesa existente', async () => {
      const updateData = {
        escuela: 'Nueva Escuela',
        direccion: 'Nueva Dirección 456'
      };

      const expectedResponse = { id: 1, ...updateData };
      mockApi.put.mockResolvedValueOnce({ data: { data: expectedResponse } });

      const result = await mesaService.update(1, updateData);

      expect(mockApi.put).toHaveBeenCalledWith('/mesas/1', updateData);
      expect(result).toEqual(expectedResponse);
    });

    it('debe manejar error 422 en update', async () => {
      const updateData = { estado: 'ABIERTA' };

      const validationError = {
        response: {
          status: 422,
          data: {
            message: 'Error de validación',
            errors: {
              estado: ['La mesa ya está abierta']
            }
          }
        }
      };

      mockApi.put.mockRejectedValueOnce(validationError);

      await expect(mesaService.update(1, updateData)).rejects.toEqual({
        message: 'Error de validación',
        errors: {
          estado: ['La mesa ya está abierta']
        }
      });
    });
  });

  describe('delete()', () => {
    it('debe eliminar mesa', async () => {
      const expectedResponse = { id: 1, deleted: true };
      mockApi.delete.mockResolvedValueOnce({ data: { data: expectedResponse } });

      const result = await mesaService.delete(1);

      expect(mockApi.delete).toHaveBeenCalledWith('/mesas/1');
      expect(result).toEqual(expectedResponse);
    });
  });

  // ========== TESTS PARA MÉTODOS ESPECÍFICOS ==========
  describe('getTelegrama()', () => {
    it('debe obtener telegrama de una mesa', async () => {
      const expectedTelegrama = { id: 1, mesa_id: 123 };
      mockApi.get.mockResolvedValueOnce({ data: { data: expectedTelegrama } });

      const result = await mesaService.getTelegrama(123);

      expect(mockApi.get).toHaveBeenCalledWith('/mesas/123/telegramas');
      expect(result).toEqual(expectedTelegrama);
    });
  });

  describe('cerrarMesa()', () => {
    it('debe marcar mesa como cerrada', async () => {
      const expectedResponse = { id: 1, estado: 'CERRADA' };
      mockApi.put.mockResolvedValueOnce({ data: { data: expectedResponse } });

      const result = await mesaService.cerrarMesa(1);

      expect(mockApi.put).toHaveBeenCalledWith('/mesas/1/cerrar');
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('abrirMesa()', () => {
    it('debe marcar mesa como abierta', async () => {
      const expectedResponse = { id: 1, estado: 'ABIERTA' };
      mockApi.put.mockResolvedValueOnce({ data: { data: expectedResponse } });

      const result = await mesaService.abrirMesa(1);

      expect(mockApi.put).toHaveBeenCalledWith('/mesas/1/abrir');
      expect(result).toEqual(expectedResponse);
    });
  });
});
