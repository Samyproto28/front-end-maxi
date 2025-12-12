/**
 * Servicio de API para consulta de resultados electorales
 * Consume endpoints del backend Laravel según especificación PRD sección 7.3
 *
 * @see PRD Backend sección 7.3 - Mapeo de Endpoints Frontend → Backend
 */

import api from './api';

/**
 * @typedef {Object} ResultadoProvincial
 * @property {Object} provincia - Datos de la provincia
 * @property {string} cargo - Cargo electoral (DIPUTADOS, SENADORES)
 * @property {number} mesas_totales - Total de mesas
 * @property {number} mesas_escrutadas - Mesas escrutadas
 * @property {number} electores - Total de electores
 * @property {number} votos_emitidos - Votos emitidos
 * @property {number} participacion - Porcentaje de participación
 * @property {Array} listas - Resultados por lista
 * @property {Object} blancos - Votos en blanco
 * @property {Object} nulos - Votos nulos
 * @property {Object} recurridos - Votos recurridos
 */

/**
 * @typedef {Object} ResultadoNacional
 * @property {string} cargo - Cargo electoral
 * @property {number} total_electores - Total de electores nacionales
 * @property {number} total_votos_emitidos - Total de votos emitidos
 * @property {number} participacion - Porcentaje de participación
 * @property {Array} provincias - Resultados por provincia
 * @property {Array} listas - Ranking nacional de listas
 */

const resultadoService = {
  /**
   * Obtener resultados provinciales
   * @param {number} provinciaId - ID de la provincia
   * @param {Object} params - Parámetros adicionales (cargo, etc.)
   * @returns {Promise<ResultadoProvincial>} Resultados provinciales
   * @endpoint GET /api/v1/resultados/provincial/{provinciaId}
   */
  getProvincial(provinciaId, params) {
    return api.get(`/resultados/provincial/${provinciaId}`, { params }).then(res => res.data.data);
  },

  /**
   * Obtener resultados nacionales
   * @param {Object} params - Parámetros adicionales (cargo, etc.)
   * @returns {Promise<ResultadoNacional>} Resultados nacionales
   * @endpoint GET /api/v1/resultados/nacional
   */
  getNacional(params) {
    return api.get('/resultados/nacional', { params }).then(res => res.data.data);
  },

  /**
   * Obtener resultados por candidato
   * @param {number} candidatoId - ID del candidato
   * @param {Object} params - Parámetros adicionales
   * @returns {Promise<Object>} Resultados del candidato
   * @endpoint GET /api/v1/resultados/candidato/{candidatoId}
   */
  getByCandidato(candidatoId, params) {
    return api.get(`/resultados/candidato/${candidatoId}`, { params }).then(res => res.data.data);
  },

  /**
   * Obtener resultados por lista
   * @param {number} listaId - ID de la lista
   * @param {Object} params - Parámetros adicionales
   * @returns {Promise<Object>} Resultados de la lista
   * @endpoint GET /api/v1/resultados/lista/{listaId}
   */
  getByLista(listaId, params) {
    return api.get(`/resultados/lista/${listaId}`, { params }).then(res => res.data.data);
  },

  /**
   * Obtener participación por provincia
   * @param {Object} params - Parámetros adicionales (cargo, etc.)
   * @returns {Promise<Array>} Participación por provincia
   * @endpoint GET /api/v1/resultados/participacion
   */
  getParticipacion(params) {
    return api.get('/resultados/participacion', { params }).then(res => res.data.data);
  },

  /**
   * Obtener ranking de listas a nivel nacional
   * @param {Object} params - Parámetros (cargo, etc.)
   * @returns {Promise<Array>} Ranking de listas
   * @endpoint GET /api/v1/resultados/ranking-listas
   */
  getRankingListas(params) {
    return api.get('/resultados/ranking-listas', { params }).then(res => res.data.data);
  },

  /**
   * Obtener resumen general de elecciones
   * @param {Object} params - Parámetros (cargo, etc.)
   * @returns {Promise<Object>} Resumen general
   * @endpoint GET /api/v1/resultados/resumen
   */
  getResumen(params) {
    return api.get('/resultados/resumen', { params }).then(res => res.data.data);
  },

  /**
   * Exportar resultados provinciales a CSV
   * @param {number} provinciaId - ID de la provincia
   * @returns {Promise<Blob>} Archivo CSV
   * @endpoint GET /api/v1/export/provincial/{provinciaId}
   */
  exportProvincial(provinciaId) {
    return api.get(`/export/provincial/${provinciaId}`, {
      responseType: 'blob'
    }).then(res => res.data);
  },

  /**
   * Exportar resultados nacionales a CSV
   * @returns {Promise<Blob>} Archivo CSV
   * @endpoint GET /api/v1/export/nacional
   */
  exportNacional() {
    return api.get('/export/nacional', {
      responseType: 'blob'
    }).then(res => res.data);
  }
};

export default resultadoService;
