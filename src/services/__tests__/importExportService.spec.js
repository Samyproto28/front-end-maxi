/**
 * Tests para importExportService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import importExportService, { downloadBlob } from '../importExportService';
import api from '../api';

vi.mock('../api');

describe('importExportService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Import Methods', () => {
    it('importProvincias sends FormData with correct Content-Type', async () => {
      const mockFile = new File(['test'], 'provincias.csv', { type: 'text/csv' });
      const mockResponse = { data: { data: { total: 10, success: 10, errors: 0 } } };
      api.post.mockResolvedValue(mockResponse);

      const result = await importExportService.importProvincias(mockFile);

      expect(api.post).toHaveBeenCalledWith(
        '/import/provincias',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it('importListas sends FormData correctly', async () => {
      const mockFile = new File(['test'], 'listas.csv', { type: 'text/csv' });
      const mockResponse = { data: { data: { total: 5, success: 5, errors: 0 } } };
      api.post.mockResolvedValue(mockResponse);

      await importExportService.importListas(mockFile);

      expect(api.post).toHaveBeenCalledWith(
        '/import/listas',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    });

    it('importMesas sends FormData correctly', async () => {
      const mockFile = new File(['test'], 'mesas.csv', { type: 'text/csv' });
      const mockResponse = { data: { data: { total: 100, success: 100, errors: 0 } } };
      api.post.mockResolvedValue(mockResponse);

      await importExportService.importMesas(mockFile);

      expect(api.post).toHaveBeenCalledWith(
        '/import/mesas',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    });

    it('importTelegramas sends FormData correctly', async () => {
      const mockFile = new File(['test'], 'telegramas.csv', { type: 'text/csv' });
      const mockResponse = { data: { data: { total: 50, success: 48, errors: 2 } } };
      api.post.mockResolvedValue(mockResponse);

      const result = await importExportService.importTelegramas(mockFile);

      expect(api.post).toHaveBeenCalledWith(
        '/import/telegramas',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      expect(result.errors).toBe(2);
    });
  });

  describe('Export Methods', () => {
    it('exportProvincial uses responseType blob', async () => {
      const mockBlob = new Blob(['csv,data'], { type: 'text/csv' });
      api.get.mockResolvedValue({ data: mockBlob });

      const result = await importExportService.exportProvincial(1);

      expect(api.get).toHaveBeenCalledWith('/export/provincial/1', {
        params: {},
        responseType: 'blob'
      });
      expect(result).toBeInstanceOf(Blob);
    });

    it('exportProvincial accepts params', async () => {
      const mockBlob = new Blob(['csv,data'], { type: 'text/csv' });
      api.get.mockResolvedValue({ data: mockBlob });

      await importExportService.exportProvincial(1, { cargo: 'DIPUTADOS' });

      expect(api.get).toHaveBeenCalledWith('/export/provincial/1', {
        params: { cargo: 'DIPUTADOS' },
        responseType: 'blob'
      });
    });

    it('exportNacional uses responseType blob', async () => {
      const mockBlob = new Blob(['csv,data'], { type: 'text/csv' });
      api.get.mockResolvedValue({ data: mockBlob });

      const result = await importExportService.exportNacional();

      expect(api.get).toHaveBeenCalledWith('/export/nacional', {
        params: {},
        responseType: 'blob'
      });
      expect(result).toBeInstanceOf(Blob);
    });
  });

  describe('downloadBlob helper', () => {
    it('throws error if blob is not a Blob instance', () => {
      expect(() => downloadBlob('not a blob', 'file.csv')).toThrow('debe ser una instancia de Blob');
    });

    it('throws error if filename is not provided', () => {
      const blob = new Blob(['test']);
      expect(() => downloadBlob(blob, '')).toThrow('nombre de archivo es requerido');
    });

    it('creates and clicks download link', () => {
      const blob = new Blob(['test'], { type: 'text/csv' });
      const mockCreateObjectURL = vi.fn(() => 'blob:url');
      const mockRevokeObjectURL = vi.fn();
      const mockClick = vi.fn();
      const mockAppendChild = vi.fn();
      const mockRemoveChild = vi.fn();

      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;
      document.body.appendChild = mockAppendChild;
      document.body.removeChild = mockRemoveChild;

      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tag) => {
        const element = originalCreateElement(tag);
        if (tag === 'a') {
          element.click = mockClick;
        }
        return element;
      });

      downloadBlob(blob, 'test.csv');

      expect(mockCreateObjectURL).toHaveBeenCalledWith(blob);
      expect(mockClick).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:url');
    });
  });
});
