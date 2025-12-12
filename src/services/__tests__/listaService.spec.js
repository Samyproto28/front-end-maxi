/**
 * Tests unitarios para listaService
 * Verifica que los métodos llaman a los endpoints correctos y retornan la estructura esperada
 */

import { describe, it, expect, vi } from 'vitest';
import listaService from '../listaService';

// Mock del módulo api
vi.mock('../api', () => ({
  default: {
    get: vi.fn()
  }
}));

import api from '../api';

describe('listaService', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('debe llamar a GET /listas y retornar data.data', async () => {
      // Arrange
      const mockListas = [
        { id: 1, nombre: 'Unión por la Patria', sigla: 'UP', cargo: 'DIPUTADOS', activa: true },
        { id: 2, nombre: 'Juntos por el Cambio', sigla: 'JxC', cargo: 'DIPUTADOS', activa: true }
      ];
      api.get.mockResolvedValue({ data: { data: mockListas } });

      // Act
      const result = await listaService.getAll();

      // Assert
      expect(api.get).toHaveBeenCalledWith('/listas');
      expect(result).toEqual(mockListas);
      expect(result).toHaveLength(2);
    });

    it('debe manejar errores correctamente', async () => {
      // Arrange
      const error = new Error('API Error');
      api.get.mockRejectedValue(error);

      // Act & Assert
      await expect(listaService.getAll()).rejects.toThrow('API Error');
      expect(api.get).toHaveBeenCalledWith('/listas');
    });
  });

  describe('getById', () => {
    it('debe llamar a GET /listas/{id} con el ID correcto', async () => {
      // Arrange
      const mockLista = {
        id: 1,
        nombre: 'Unión por la Patria',
        sigla: 'UP',
        cargo: 'DIPUTADOS',
        activa: true
      };
      api.get.mockResolvedValue({ data: { data: mockLista } });

      // Act
      const result = await listaService.getById(1);

      // Assert
      expect(api.get).toHaveBeenCalledWith('/listas/1');
      expect(result).toEqual(mockLista);
      expect(result.id).toBe(1);
    });

    it('debe retornar todos los campos de la lista', async () => {
      // Arrange
      const mockLista = {
        id: 5,
        nombre: 'Lista Test',
        sigla: 'LT',
        cargo: 'SENADORES',
        activa: false,
        provincia_id: 1
      };
      api.get.mockResolvedValue({ data: { data: mockLista } });

      // Act
      const result = await listaService.getById(5);

      // Assert
      expect(api.get).toHaveBeenCalledWith('/listas/5');
      expect(result).toEqual(mockLista);
      expect(result.nombre).toBe('Lista Test');
      expect(result.activa).toBe(false);
    });
  });

  describe('getByProvincia', () => {
    it('debe llamar a GET /listas con params provincia_id', async () => {
      // Arrange
      const provinciaId = 1;
      const mockListas = [
        { id: 1, nombre: 'Lista A', provincia_id: 1 },
        { id: 2, nombre: 'Lista B', provincia_id: 1 }
      ];
      api.get.mockResolvedValue({ data: { data: mockListas } });

      // Act
      const result = await listaService.getByProvincia(provinciaId);

      // Assert
      expect(api.get).toHaveBeenCalledWith('/listas', {
        params: { provincia_id: 1 }
      });
      expect(result).toEqual(mockListas);
    });

    it('debe enviar el parámetro query correctamente con {params}', async () => {
      // Arrange
      const provinciaId = 5;
      api.get.mockResolvedValue({ data: { data: [] } });

      // Act
      await listaService.getByProvincia(provinciaId);

      // Assert
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith('/listas', {
        params: { provincia_id: 5 }
      });
    });

    it('debe filtrar listas por provincia específica', async () => {
      // Arrange
      const provinciaId = 2;
      const listasBuenosAires = [
        { id: 10, nombre: 'Lista BA1', provincia_id: 2 },
        { id: 11, nombre: 'Lista BA2', provincia_id: 2 }
      ];
      api.get.mockResolvedValue({ data: { data: listasBuenosAires } });

      // Act
      const result = await listaService.getByProvincia(provinciaId);

      // Assert
      expect(result).toEqual(listasBuenosAires);
      expect(result.every(l => l.provincia_id === provinciaId)).toBe(true);
    });
  });

  describe('getCandidatos', () => {
    it('debe llamar a GET /listas/{id}/candidatos', async () => {
      // Arrange
      const listaId = 1;
      const mockCandidatos = [
        { id: 1, nombre: 'Candidato 1', posicion: 1 },
        { id: 2, nombre: 'Candidato 2', posicion: 2 }
      ];
      api.get.mockResolvedValue({ data: { data: mockCandidatos } });

      // Act
      const result = await listaService.getCandidatos(listaId);

      // Assert
      expect(api.get).toHaveBeenCalledWith('/listas/1/candidatos');
      expect(result).toEqual(mockCandidatos);
      expect(result).toHaveLength(2);
    });

    it('debe retornar lista de candidatos vacía cuando no hay candidatos', async () => {
      // Arrange
      api.get.mockResolvedValue({ data: { data: [] } });

      // Act
      const result = await listaService.getCandidatos(999);

      // Assert
      expect(api.get).toHaveBeenCalledWith('/listas/999/candidatos');
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('debe incluir información completa de candidatos', async () => {
      // Arrange
      const listaId = 3;
      const mockCandidatos = [
        {
          id: 1,
          nombre: 'Juan Pérez',
          apellido: 'Pérez',
          posicion: 1,
          cargo: 'DIPUTADO'
        },
        {
          id: 2,
          nombre: 'María García',
          apellido: 'García',
          posicion: 2,
          cargo: 'DIPUTADO'
        }
      ];
      api.get.mockResolvedValue({ data: { data: mockCandidatos } });

      // Act
      const result = await listaService.getCandidatos(listaId);

      // Assert
      expect(api.get).toHaveBeenCalledWith('/listas/3/candidatos');
      expect(result[0]).toHaveProperty('nombre');
      expect(result[0]).toHaveProperty('apellido');
      expect(result[0]).toHaveProperty('posicion');
    });
  });

  describe('Integración - manejo de parámetros query', () => {
    it('debe usar {params} para parámetros query en getByProvincia', async () => {
      // Arrange
      const mockListas = [{ id: 1, provincia_id: 1 }];
      api.get.mockResolvedValue({ data: { data: mockListas } });

      // Act
      const result = await listaService.getByProvincia(1);

      // Assert - Verificar que se usa la estructura correcta de params
      expect(api.get).toHaveBeenCalledWith('/listas', {
        params: { provincia_id: 1 }
      });
      expect(result).toEqual(mockListas);
    });

    it('debe permitir filtrado por diferentes provincias', async () => {
      // Arrange
      const testCases = [1, 2, 3, 5, 10];
      for (const provinciaId of testCases) {
        api.get.mockResolvedValue({ data: { data: [] } });
        await listaService.getByProvincia(provinciaId);
      }

      // Assert
      expect(api.get).toHaveBeenCalledTimes(testCases.length);
      testCases.forEach(id => {
        expect(api.get).toHaveBeenCalledWith('/listas', {
          params: { provincia_id: id }
        });
      });
    });
  });

  describe('Integración - estructura de respuesta', () => {
    it('debe extraer correctamente data.data de la respuesta del API', async () => {
      // Arrange
      const mockData = {
        id: 1,
        nombre: 'Lista Test',
        sigla: 'LT',
        cargo: 'DIPUTADOS',
        activa: true
      };
      api.get.mockResolvedValue({
        data: {
          data: mockData,
          meta: { total: 1 }
        }
      });

      // Act
      const result = await listaService.getById(1);

      // Assert
      expect(result).toEqual(mockData);
      expect(result).not.toHaveProperty('meta');
    });

    it('debe manejar respuestas con arrays en data.data', async () => {
      // Arrange
      const mockList = [{ id: 1 }, { id: 2 }, { id: 3 }];
      api.get.mockResolvedValue({
        data: {
          data: mockList
        }
      });

      // Act
      const result = await listaService.getAll();

      // Assert
      expect(result).toEqual(mockList);
      expect(result).not.toHaveProperty('data');
      expect(result).toHaveLength(3);
    });
  });

  describe('Validación de tipos de parámetros', () => {
    it('debe manejar IDs numéricos correctamente', async () => {
      // Arrange
      const numericIds = [1, 10, 100, 999];
      api.get.mockResolvedValue({ data: { data: {} } });

      // Act & Assert
      for (const id of numericIds) {
        await listaService.getById(id);
        expect(api.get).toHaveBeenCalledWith(`/listas/${id}`);
      }
    });

    it('debe manejar provincia_id numérico en getByProvincia', async () => {
      // Arrange
      const provinciaId = 123;
      api.get.mockResolvedValue({ data: { data: [] } });

      // Act
      await listaService.getByProvincia(provinciaId);

      // Assert
      expect(api.get).toHaveBeenCalledWith('/listas', {
        params: { provincia_id: provinciaId }
      });
      expect(typeof provinciaId).toBe('number');
    });
  });
});
