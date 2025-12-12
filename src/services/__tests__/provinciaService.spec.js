/**
 * Tests unitarios para provinciaService
 * Verifica que los métodos llaman a los endpoints correctos y retornan la estructura esperada
 */

import { describe, it, expect, vi } from 'vitest';
import provinciaService from '../provinciaService';

// Mock del módulo api
vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

import api from '../api';

describe('provinciaService', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('debe llamar a GET /provincias y retornar data.data', async () => {
      // Arrange
      const mockData = [
        { id: 1, nombre: 'Buenos Aires', codigo: 'BA' },
        { id: 2, nombre: 'Córdoba', codigo: 'CB' }
      ];
      api.get.mockResolvedValue({ data: { data: mockData } });

      // Act
      const result = await provinciaService.getAll();

      // Assert
      expect(api.get).toHaveBeenCalledWith('/provincias');
      expect(result).toEqual(mockData);
      expect(result).toHaveLength(2);
    });

    it('debe manejar errores correctamente', async () => {
      // Arrange
      const error = new Error('Network error');
      api.get.mockRejectedValue(error);

      // Act & Assert
      await expect(provinciaService.getAll()).rejects.toThrow('Network error');
      expect(api.get).toHaveBeenCalledWith('/provincias');
    });
  });

  describe('getById', () => {
    it('debe llamar a GET /provincias/{id} con el ID correcto', async () => {
      // Arrange
      const mockProvincia = { id: 1, nombre: 'Buenos Aires', codigo: 'BA' };
      api.get.mockResolvedValue({ data: { data: mockProvincia } });

      // Act
      const result = await provinciaService.getById(1);

      // Assert
      expect(api.get).toHaveBeenCalledWith('/provincias/1');
      expect(result).toEqual(mockProvincia);
      expect(result.id).toBe(1);
    });

    it('debe funcionar con diferentes tipos de ID', async () => {
      // Arrange
      const mockProvincia = { id: 999, nombre: 'Test', codigo: 'TS' };
      api.get.mockResolvedValue({ data: { data: mockProvincia } });

      // Act
      const result = await provinciaService.getById(999);

      // Assert
      expect(api.get).toHaveBeenCalledWith('/provincias/999');
      expect(result).toEqual(mockProvincia);
    });
  });

  describe('create', () => {
    it('debe llamar a POST /provincias con los datos correctos', async () => {
      // Arrange
      const newProvincia = { nombre: 'Nueva Provincia', codigo: 'NP' };
      const mockResponse = { id: 10, ...newProvincia };
      api.post.mockResolvedValue({ data: { data: mockResponse } });

      // Act
      const result = await provinciaService.create(newProvincia);

      // Assert
      expect(api.post).toHaveBeenCalledWith('/provincias', newProvincia);
      expect(result).toEqual(mockResponse);
      expect(result.id).toBe(10);
    });

    it('debe enviar todos los campos requeridos', async () => {
      // Arrange
      const provinciaData = {
        nombre: 'Test Province',
        codigo: 'TP'
      };
      api.post.mockResolvedValue({ data: { data: { id: 5, ...provinciaData } } });

      // Act
      await provinciaService.create(provinciaData);

      // Assert
      expect(api.post).toHaveBeenCalledWith('/provincias', provinciaData);
    });
  });

  describe('update', () => {
    it('debe llamar a PUT /provincias/{id} con los datos correctos', async () => {
      // Arrange
      const id = 1;
      const updates = { nombre: 'Buenos Aires Actualizada', codigo: 'BA' };
      const mockResponse = { id, ...updates };
      api.put.mockResolvedValue({ data: { data: mockResponse } });

      // Act
      const result = await provinciaService.update(id, updates);

      // Assert
      expect(api.put).toHaveBeenCalledWith('/provincias/1', updates);
      expect(result).toEqual(mockResponse);
    });

    it('debe permitir actualización parcial', async () => {
      // Arrange
      const id = 2;
      const partialUpdate = { nombre: 'Solo Nombre' };
      api.put.mockResolvedValue({ data: { data: { id, ...partialUpdate } } });

      // Act
      const result = await provinciaService.update(id, partialUpdate);

      // Assert
      expect(api.put).toHaveBeenCalledWith('/provincias/2', partialUpdate);
      expect(result.nombre).toBe('Solo Nombre');
    });
  });

  describe('delete', () => {
    it('debe llamar a DELETE /provincias/{id}', async () => {
      // Arrange
      const id = 1;
      const mockDeleted = { id: 1, nombre: 'Buenos Aires', codigo: 'BA' };
      api.delete.mockResolvedValue({ data: { data: mockDeleted } });

      // Act
      const result = await provinciaService.delete(id);

      // Assert
      expect(api.delete).toHaveBeenCalledWith('/provincias/1');
      expect(result).toEqual(mockDeleted);
    });

    it('debe retornar los datos de la provincia eliminada', async () => {
      // Arrange
      const id = 5;
      const deletedData = { id: 5, nombre: 'Eliminada', codigo: 'EL' };
      api.delete.mockResolvedValue({ data: { data: deletedData } });

      // Act
      const result = await provinciaService.delete(id);

      // Assert
      expect(result).toEqual(deletedData);
    });
  });

  describe('getListas', () => {
    it('debe llamar a GET /provincias/{id}/listas', async () => {
      // Arrange
      const provinciaId = 1;
      const mockListas = [
        { id: 1, nombre: 'Lista A', sigla: 'LA' },
        { id: 2, nombre: 'Lista B', sigla: 'LB' }
      ];
      api.get.mockResolvedValue({ data: { data: mockListas } });

      // Act
      const result = await provinciaService.getListas(provinciaId);

      // Assert
      expect(api.get).toHaveBeenCalledWith('/provincias/1/listas');
      expect(result).toEqual(mockListas);
      expect(result).toHaveLength(2);
    });

    it('debe retornar arrays vacíos cuando no hay listas', async () => {
      // Arrange
      api.get.mockResolvedValue({ data: { data: [] } });

      // Act
      const result = await provinciaService.getListas(999);

      // Assert
      expect(api.get).toHaveBeenCalledWith('/provincias/999/listas');
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getMesas', () => {
    it('debe llamar a GET /provincias/{id}/mesas', async () => {
      // Arrange
      const provinciaId = 1;
      const mockMesas = [
        { id: 1, numero: 1001, electores: 350 },
        { id: 2, numero: 1002, electores: 350 }
      ];
      api.get.mockResolvedValue({ data: { data: mockMesas } });

      // Act
      const result = await provinciaService.getMesas(provinciaId);

      // Assert
      expect(api.get).toHaveBeenCalledWith('/provincias/1/mesas');
      expect(result).toEqual(mockMesas);
    });

    it('debe funcionar con provincias con muchas mesas', async () => {
      // Arrange
      const manyMesas = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        numero: 1000 + i,
        electores: 350
      }));
      api.get.mockResolvedValue({ data: { data: manyMesas } });

      // Act
      const result = await provinciaService.getMesas(1);

      // Assert
      expect(api.get).toHaveBeenCalledWith('/provincias/1/mesas');
      expect(result).toHaveLength(100);
    });
  });

  describe('Integración - estructura de respuesta', () => {
    it('debe extraer correctamente data.data de la respuesta del API', async () => {
      // Arrange
      const mockData = { id: 1, nombre: 'Test', codigo: 'TT' };
      api.get.mockResolvedValue({
        data: {
          data: mockData,
          meta: { total: 1 }
        }
      });

      // Act
      const result = await provinciaService.getById(1);

      // Assert
      expect(result).toEqual(mockData);
      expect(result).not.toHaveProperty('meta');
    });

    it('debe manejar respuestas con estructura anidada data.data.data', async () => {
      // Arrange - este caso maneja respuestas con doble anidación
      const mockList = [{ id: 1 }, { id: 2 }];
      api.get.mockResolvedValue({
        data: {
          data: mockList
        }
      });

      // Act
      const result = await provinciaService.getAll();

      // Assert
      expect(result).toEqual(mockList);
      expect(result).not.toHaveProperty('data');
    });
  });
});
