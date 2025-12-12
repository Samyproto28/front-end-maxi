/**
 * Servicio de API para gestión de provincias
 * Consume endpoints del backend Laravel según especificación PRD sección 7.3
 *
 * @see PRD Backend sección 7.3 - Mapeo de Endpoints Frontend → Backend
 */

import api from './api';

/**
 * @typedef {Object} Provincia
 * @property {number} id - ID único de la provincia
 * @property {string} nombre - Nombre de la provincia
 * @property {string} codigo - Código de provincia (ej: BA, CBA)
 */

const provinciaService = {
  /**
   * Obtener todas las provincias
   * @returns {Promise<Provincia[]>} Lista de provincias
   * @endpoint GET /api/v1/provincias
   */
  getAll() {
    return api.get('/provincias').then(res => res.data.data);
  },

  /**
   * Obtener provincia por ID
   * @param {number} id - ID de la provincia
   * @returns {Promise<Provincia>} Datos de la provincia
   * @endpoint GET /api/v1/provincias/{id}
   */
  getById(id) {
    return api.get(`/provincias/${id}`).then(res => res.data.data);
  },

  /**
   * Crear nueva provincia
   * @param {Omit<Provincia, 'id'>} data - Datos de la provincia
   * @returns {Promise<Provincia>} Provincia creada
   * @endpoint POST /api/v1/provincias
   */
  create(data) {
    return api.post('/provincias', data).then(res => res.data.data);
  },

  /**
   * Actualizar provincia existente
   * @param {number} id - ID de la provincia
   * @param {Partial<Omit<Provincia, 'id'>>} data - Datos a actualizar
   * @returns {Promise<Provincia>} Provincia actualizada
   * @endpoint PUT /api/v1/provincias/{id}
   */
  update(id, data) {
    return api.put(`/provincias/${id}`, data).then(res => res.data.data);
  },

  /**
   * Eliminar provincia
   * @param {number} id - ID de la provincia
   * @returns {Promise<Provincia>} Provincia eliminada
   * @endpoint DELETE /api/v1/provincias/{id}
   */
  delete(id) {
    return api.delete(`/provincias/${id}`).then(res => res.data.data);
  },

  /**
   * Obtener listas de una provincia específica
   * @param {number} id - ID de la provincia
   * @returns {Promise<Array>} Lista de listas electorales de la provincia
   * @endpoint GET /api/v1/provincias/{id}/listas
   */
  getListas(id) {
    return api.get(`/provincias/${id}/listas`).then(res => res.data.data);
  },

  /**
   * Obtener mesas de una provincia específica
   * @param {number} id - ID de la provincia
   * @returns {Promise<Array>} Lista de mesas de la provincia
   * @endpoint GET /api/v1/provincias/{id}/mesas
   */
  getMesas(id) {
    return api.get(`/provincias/${id}/mesas`).then(res => res.data.data);
  }
};

export default provinciaService;
