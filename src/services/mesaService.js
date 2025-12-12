/**
 * Servicio de API para gestión de mesas de votación
 * Consume endpoints del backend Laravel según especificación PRD sección 7.3
 *
 * @see PRD Backend sección 7.3 - Mapeo de Endpoints Frontend → Backend
 */

import api from './api';

/**
 * Helper function to parse Laravel validation errors
 * @param {Object} errorData - Error response from Laravel API
 * @returns {Object} Formatted validation errors
 */
const parseValidationErrors = (errorData) => {
  return {
    message: errorData.message || 'Los datos proporcionados no son válidos.',
    errors: errorData.errors || {}
  };
};

/**
 * @typedef {Object} Mesa
 * @property {number} id - ID único de la mesa
 * @property {number} numero - Número de mesa
 * @property {string} escuela - Nombre de la escuela
 * @property {string} direccion - Dirección de la escuela
 * @property {number} provincia_id - ID de la provincia
 * @property {number} electores - Cantidad de electores habilitados
 * @property {string} estado - Estado (ABIERTA, CERRADA)
 * @property {boolean} telegramaCargado - Si ya se cargó el telegrama
 */

const mesaService = {
  /**
   * Obtener todas las mesas
   * @returns {Promise<Mesa[]>} Lista de mesas
   * @endpoint GET /api/v1/mesas
   */
  getAll() {
    return api.get('/mesas').then(res => res.data.data);
  },

  /**
   * Obtener mesa por ID
   * @param {number} id - ID de la mesa
   * @returns {Promise<Mesa>} Datos de la mesa
   * @endpoint GET /api/v1/mesas/{id}
   */
  getById(id) {
    return api.get(`/mesas/${id}`).then(res => res.data.data);
  },

  /**
   * Obtener mesas por provincia
   * @param {number} provinciaId - ID de la provincia
   * @returns {Promise<Mesa[]>} Lista de mesas de la provincia
   * @endpoint GET /api/v1/provincias/{id}/mesas
   */
  getByProvincia(provinciaId) {
    return api.get(`/provincias/${provinciaId}/mesas`).then(res => res.data.data);
  },

  /**
   * Crear nueva mesa
   * @param {Omit<Mesa, 'id'>} data - Datos de la mesa
   * @returns {Promise<Mesa>} Mesa creada
   * @endpoint POST /api/v1/mesas
   */
  create(data) {
    return api.post('/mesas', data)
      .then(res => res.data.data)
      .catch(error => {
        // Manejar errores 422 de validación Laravel
        if (error.response?.status === 422) {
          throw parseValidationErrors(error.response.data);
        }
        throw error;
      });
  },

  /**
   * Actualizar mesa existente
   * @param {number} id - ID de la mesa
   * @param {Partial<Omit<Mesa, 'id'>>} data - Datos a actualizar
   * @returns {Promise<Mesa>} Mesa actualizada
   * @endpoint PUT /api/v1/mesas/{id}
   */
  update(id, data) {
    return api.put(`/mesas/${id}`, data)
      .then(res => res.data.data)
      .catch(error => {
        // Manejar errores 422 de validación Laravel
        if (error.response?.status === 422) {
          throw parseValidationErrors(error.response.data);
        }
        throw error;
      });
  },

  /**
   * Eliminar mesa
   * @param {number} id - ID de la mesa
   * @returns {Promise<Mesa>} Mesa eliminada
   * @endpoint DELETE /api/v1/mesas/{id}
   */
  delete(id) {
    return api.delete(`/mesas/${id}`).then(res => res.data.data);
  },

  /**
   * Obtener telegrama de una mesa
   * @param {number} mesaId - ID de la mesa
   * @returns {Promise<Object>} Telegrama de la mesa
   * @endpoint GET /api/v1/mesas/{id}/telegramas
   */
  getTelegrama(mesaId) {
    return api.get(`/mesas/${mesaId}/telegramas`).then(res => res.data.data);
  },

  /**
   * Marcar mesa como cerrada
   * @param {number} id - ID de la mesa
   * @returns {Promise<Mesa>} Mesa actualizada
   * @endpoint PUT /api/v1/mesas/{id}/cerrar
   */
  cerrarMesa(id) {
    return api.put(`/mesas/${id}/cerrar`).then(res => res.data.data);
  },

  /**
   * Marcar mesa como abierta
   * @param {number} id - ID de la mesa
   * @returns {Promise<Mesa>} Mesa actualizada
   * @endpoint PUT /api/v1/mesas/{id}/abrir
   */
  abrirMesa(id) {
    return api.put(`/mesas/${id}/abrir`).then(res => res.data.data);
  }
};

export default mesaService;
