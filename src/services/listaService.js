/**
 * Servicio de API para gestión de listas electorales
 * Consume endpoints del backend Laravel según especificación PRD sección 7.3
 *
 * @see PRD Backend sección 7.3 - Mapeo de Endpoints Frontend → Backend
 */

import api from './api';

/**
 * @typedef {Object} Lista
 * @property {number} id - ID único de la lista
 * @property {string} nombre - Nombre de la lista
 * @property {string} sigla - Sigla o abreviación
 * @property {string} cargo - Cargo electoral (DIPUTADOS, SENADORES)
 * @property {boolean} activa - Estado de la lista
 * @property {number} [provincia_id] - ID de la provincia (opcional)
 */

const listaService = {
  /**
   * Obtener todas las listas electorales
   * @returns {Promise<Lista[]>} Lista de listas electorales
   * @endpoint GET /api/v1/listas
   */
  getAll() {
    return api.get('/listas').then(res => res.data.data);
  },

  /**
   * Obtener lista por ID
   * @param {number} id - ID de la lista
   * @returns {Promise<Lista>} Datos de la lista
   * @endpoint GET /api/v1/listas/{id}
   */
  getById(id) {
    return api.get(`/listas/${id}`).then(res => res.data.data);
  },

  /**
   * Obtener listas filtradas por provincia
   * @param {number} provinciaId - ID de la provincia
   * @returns {Promise<Lista[]>} Lista de listas de la provincia
   * @endpoint GET /api/v1/listas?provincia_id={provinciaId}
   */
  getByProvincia(provinciaId) {
    return api.get('/listas', {
      params: { provincia_id: provinciaId }
    }).then(res => res.data.data);
  },

  /**
   * Obtener candidatos de una lista específica
   * @param {number} listaId - ID de la lista
   * @returns {Promise<Array>} Lista de candidatos
   * @endpoint GET /api/v1/listas/{id}/candidatos
   */
  getCandidatos(listaId) {
    return api.get(`/listas/${listaId}/candidatos`).then(res => res.data.data);
  }
};

export default listaService;
