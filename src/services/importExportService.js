/**
 * Servicio de API para importación y exportación de datos
 * Consume endpoints del backend Laravel para operaciones de archivo CSV
 *
 * @see PRD Backend sección 7.3 - Mapeo de Endpoints Frontend → Backend
 */

import api from './api';

/**
 * @typedef {Object} ImportResult
 * @property {number} total - Total de registros procesados
 * @property {number} success - Registros importados exitosamente
 * @property {number} errors - Cantidad de errores
 * @property {Array<string>} messages - Mensajes de resultado
 */

const importExportService = {
  // ==================== MÉTODOS DE IMPORTACIÓN ====================

  /**
   * Importar provincias desde archivo CSV
   * @param {File} file - Archivo CSV a importar
   * @returns {Promise<ImportResult>} Resultado de la importación
   * @endpoint POST /api/v1/import/provincias
   */
  importProvincias(file) {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/import/provincias', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },

  /**
   * Importar listas electorales desde archivo CSV
   * @param {File} file - Archivo CSV a importar
   * @returns {Promise<ImportResult>} Resultado de la importación
   * @endpoint POST /api/v1/import/listas
   */
  importListas(file) {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/import/listas', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },

  /**
   * Importar mesas electorales desde archivo CSV
   * @param {File} file - Archivo CSV a importar
   * @returns {Promise<ImportResult>} Resultado de la importación
   * @endpoint POST /api/v1/import/mesas
   */
  importMesas(file) {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/import/mesas', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },

  /**
   * Importar telegramas desde archivo CSV
   * @param {File} file - Archivo CSV a importar
   * @returns {Promise<ImportResult>} Resultado de la importación
   * @endpoint POST /api/v1/import/telegramas
   */
  importTelegramas(file) {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/import/telegramas', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },

  // ==================== MÉTODOS DE EXPORTACIÓN ====================

  /**
   * Exportar resultados provinciales a CSV
   * @param {number} provinciaId - ID de la provincia
   * @param {Object} params - Parámetros opcionales (cargo, etc.)
   * @returns {Promise<Blob>} Archivo CSV como Blob
   * @endpoint GET /api/v1/export/provincial/{provinciaId}
   */
  exportProvincial(provinciaId, params = {}) {
    return api.get(`/export/provincial/${provinciaId}`, {
      params,
      responseType: 'blob'
    }).then(res => res.data);
  },

  /**
   * Exportar resultados nacionales a CSV
   * @param {Object} params - Parámetros opcionales (cargo, etc.)
   * @returns {Promise<Blob>} Archivo CSV como Blob
   * @endpoint GET /api/v1/export/nacional
   */
  exportNacional(params = {}) {
    return api.get('/export/nacional', {
      params,
      responseType: 'blob'
    }).then(res => res.data);
  },

  // ==================== WRAPPERS CON DESCARGA AUTOMÁTICA ====================

  /**
   * Exportar y descargar resultados provinciales
   * @param {number} provinciaId - ID de la provincia
   * @param {string} filename - Nombre del archivo (opcional)
   * @param {Object} params - Parámetros opcionales
   * @returns {Promise<void>}
   */
  async exportProvincialAndDownload(provinciaId, filename, params = {}) {
    const blob = await this.exportProvincial(provinciaId, params);
    const name = filename || `resultados-provincial-${provinciaId}-${Date.now()}.csv`;
    downloadBlob(blob, name);
  },

  /**
   * Exportar y descargar resultados nacionales
   * @param {string} filename - Nombre del archivo (opcional)
   * @param {Object} params - Parámetros opcionales
   * @returns {Promise<void>}
   */
  async exportNacionalAndDownload(filename, params = {}) {
    const blob = await this.exportNacional(params);
    const name = filename || `resultados-nacional-${Date.now()}.csv`;
    downloadBlob(blob, name);
  }
};

/**
 * Descargar un Blob como archivo en el navegador
 * @param {Blob} blob - Blob a descargar
 * @param {string} filename - Nombre del archivo
 */
export function downloadBlob(blob, filename) {
  if (!(blob instanceof Blob)) {
    throw new Error('El primer argumento debe ser una instancia de Blob');
  }
  if (typeof filename !== 'string' || !filename) {
    throw new Error('El nombre de archivo es requerido');
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default importExportService;
