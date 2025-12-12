/**
 * Servicio de API para gestión de telegramas electorales
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
 * @typedef {Object} Telegrama
 * @property {number} id - ID único del telegrama
 * @property {number} mesa_id - ID de la mesa
 * @property {string} usuario - Usuario que carga el telegrama
 * @property {Array} votos - Array de votos por lista
 * @property {number} blancos - Votos en blanco
 * @property {number} nulos - Votos nulos
 * @property {number} recurridos - Votos recurridos
 * @property {string} estado - Estado (PENDIENTE, EN_PROCESO, VALIDADO, RECHAZADO)
 * @property {string} fechaCarga - Fecha de carga
 * @property {string} observaciones - Observaciones
 */

const telegramaService = {
  /**
   * Obtener todos los telegramas
   * @param {Object} params - Parámetros de consulta (opcional)
   * @returns {Promise<Telegrama[]>} Lista de telegramas
   * @endpoint GET /api/v1/telegramas
   */
  getAll(params) {
    return api.get('/telegramas', { params }).then(res => res.data.data);
  },

  /**
   * Obtener telegrama por ID
   * @param {number} id - ID del telegrama
   * @returns {Promise<Telegrama>} Datos del telegrama
   * @endpoint GET /api/v1/telegramas/{id}
   */
  getById(id) {
    return api.get(`/telegramas/${id}`).then(res => res.data.data);
  },

  /**
   * Obtener telegramas por mesa con filtrado avanzado
   * @param {number} mesaId - ID de la mesa
   * @param {Object} params - Parámetros de filtrado adicionales (opcional)
   * @param {string} params.cargo - Filtrar por cargo ('DIPUTADOS'|'SENADORES')
   * @param {string} params.fecha_desde - Fecha desde (formato YYYY-MM-DD)
   * @param {string} params.fecha_hasta - Fecha hasta (formato YYYY-MM-DD)
   * @param {string} params.usuario - Filtrar por usuario
   * @returns {Promise<Telegrama[]>} Lista de telegramas filtrados
   * @endpoint GET /api/v1/telegramas?mesa_id={mesaId}&...
   */
  getByMesa(mesaId, params = {}) {
    const queryParams = {
      mesa_id: mesaId,
      ...params
    };

    return api.get('/telegramas', { params: queryParams }).then(res => res.data.data);
  },

  /**
   * Crear nuevo telegrama con serialización compleja
   * @param {Object} data - Datos del telegrama con estructura compleja
   * @param {number} data.mesa_id - ID de la mesa
   * @param {string} data.usuario - Usuario que carga el telegrama
   * @param {Array} data.votos - Array de votos por lista
   * @param {number} data.votos[].lista_id - ID de la lista
   * @param {number} data.votos[].votos_diputados - Votos para diputados
   * @param {number} data.votos[].votos_senadores - Votos para senadores
   * @param {number} data.blancos - Votos en blanco
   * @param {number} data.nulos - Votos nulos
   * @param {number} data.recurridos - Votos recurridos
   * @returns {Promise<Telegrama>} Telegrama creado
   * @endpoint POST /api/v1/telegramas
   * @see PRD sección 15.2 - Estructura de payload para POST telegramas
   */
  create(data) {
    try {
      // Validar estructura requerida
      if (data.mesa_id === undefined || data.mesa_id === null ||
          !data.usuario || data.usuario === undefined || data.usuario === null ||
          !Array.isArray(data.votos)) {
        throw new Error('Faltan campos requeridos: mesa_id, usuario, votos');
      }

      // Validar que el array de votos no esté vacío
      if (data.votos.length === 0) {
        throw new Error('El array de votos debe contener al menos un elemento');
      }

      // Serializar y validar tipos de datos
      const payload = {
        mesa_id: parseInt(data.mesa_id, 10),
        usuario: String(data.usuario),
        votos: data.votos.map(voto => ({
          lista_id: parseInt(voto.lista_id, 10),
          votos_diputados: parseInt(voto.votos_diputados, 10),
          votos_senadores: parseInt(voto.votos_senadores, 10)
        })),
        blancos: parseInt(data.blancos, 10),
        nulos: parseInt(data.nulos, 10),
        recurridos: parseInt(data.recurridos, 10)
      };

      // Validar que todos los campos son integers positivos
      if (payload.mesa_id <= 0) throw new Error('mesa_id debe ser un entero positivo');
      if (!payload.usuario.trim()) throw new Error('usuario no puede estar vacío');
      if (payload.blancos < 0) throw new Error('blancos no puede ser negativo');
      if (payload.nulos < 0) throw new Error('nulos no puede ser negativo');
      if (payload.recurridos < 0) throw new Error('recurridos no puede ser negativo');

      return api.post('/telegramas', payload)
        .then(res => res.data.data)
        .catch(error => {
          // Manejar errores 422 de validación Laravel
          if (error.response?.status === 422) {
            throw parseValidationErrors(error.response.data);
          }
          throw error;
        });
    } catch (error) {
      // Re-lanzar errores de validación
      throw error;
    }
  },

  /**
   * Actualizar telegrama existente
   * @param {number} id - ID del telegrama
   * @param {Partial<Omit<Telegrama, 'id'>>} data - Datos a actualizar
   * @returns {Promise<Telegrama>} Telegrama actualizado
   * @endpoint PUT /api/v1/telegramas/{id}
   */
  update(id, data) {
    return api.put(`/telegramas/${id}`, data)
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
   * Eliminar telegrama
   * @param {number} id - ID del telegrama
   * @returns {Promise<Telegrama>} Telegrama eliminado
   * @endpoint DELETE /api/v1/telegramas/{id}
   */
  delete(id) {
    return api.delete(`/telegramas/${id}`).then(res => res.data.data);
  },

  /**
   * Validar telegrama
   * @param {number} id - ID del telegrama
   * @param {string} observaciones - Observaciones (opcional)
   * @returns {Promise<Telegrama>} Telegrama validado
   * @endpoint PUT /api/v1/telegramas/{id}/validar
   */
  validar(id, observaciones = '') {
    return api.put(`/telegramas/${id}/validar`, { observaciones }).then(res => res.data.data);
  },

  /**
   * Rechazar telegrama
   * @param {number} id - ID del telegrama
   * @param {string} observaciones - Motivo del rechazo
   * @returns {Promise<Telegrama>} Telegrama rechazado
   * @endpoint PUT /api/v1/telegramas/{id}/rechazar
   */
  rechazar(id, observaciones) {
    return api.put(`/telegramas/${id}/rechazar`, { observaciones }).then(res => res.data.data);
  },

  /**
   * Obtener estadísticas de telegramas
   * @returns {Promise<Object>} Estadísticas de carga
   * @endpoint GET /api/v1/telegramas/estadisticas
   */
  getEstadisticas() {
    return api.get('/telegramas/estadisticas').then(res => res.data.data);
  },

  /**
   * Buscar telegramas por estado
   * @param {string} estado - Estado del telegrama
   * @returns {Promise<Telegrama[]>} Lista de telegramas con el estado especificado
   * @endpoint GET /api/v1/telegramas?estado={estado}
   */
  getByEstado(estado) {
    return api.get('/telegramas', { params: { estado } }).then(res => res.data.data);
  }
};

export default telegramaService;
