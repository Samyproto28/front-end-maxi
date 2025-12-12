/**
 * Validators Utility
 *
 * This file contains validation functions for common data types and formats.
 * Use these validators to ensure data integrity throughout the application.
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {object} - {valid: boolean, error: string}
 */
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, error: 'Email es requerido' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Email debe tener un formato válido' };
  }

  return { valid: true, error: '' };
};

/**
 * Validate positive number
 * @param {any} numero - Value to validate
 * @returns {object} - {valid: boolean, error: string}
 */
export const validateNumeroPositivo = (numero) => {
  if (numero === null || numero === undefined || numero === '') {
    return { valid: false, error: 'El número es requerido' };
  }

  const numericValue = Number(numero);

  if (isNaN(numericValue)) {
    return { valid: false, error: 'Debe ser un número válido' };
  }

  if (numericValue < 0) {
    return { valid: false, error: 'El número debe ser mayor o igual a 0' };
  }

  return { valid: true, error: '' };
};

/**
 * Validate required field
 * @param {any} valor - Value to validate
 * @returns {object} - {valid: boolean, error: string}
 */
export const validateRequerido = (valor) => {
  if (valor === null || valor === undefined || valor === '') {
    return { valid: false, error: 'Este campo es requerido' };
  }

  if (typeof valor === 'string' && valor.trim() === '') {
    return { valid: false, error: 'Este campo es requerido' };
  }

  if (Array.isArray(valor) && valor.length === 0) {
    return { valid: false, error: 'Este campo es requerido' };
  }

  return { valid: true, error: '' };
};

/**
 * Validate votes array
 * @param {Array} votos - Array of votes
 * @param {number} electores - Total number of electors
 * @returns {object} - {valid: boolean, error: string}
 */
export const validateVotos = (votos, electores) => {
  // Check if votos is a valid array
  if (!Array.isArray(votos)) {
    return { valid: false, error: 'Los votos deben ser un array' };
  }

  // Check if there is at least one vote
  if (votos.length === 0) {
    return { valid: false, error: 'Debe haber al menos un voto' };
  }

  // Check if all values are numbers >= 0
  const allNumbers = votos.every(voto => {
    const num = Number(voto);
    return !isNaN(num) && num >= 0;
  });

  if (!allNumbers) {
    return { valid: false, error: 'Los votos deben ser números positivos' };
  }

  // Check if sum of votes <= electors
  const sumaVotos = votos.reduce((sum, voto) => sum + Number(voto), 0);

  if (sumaVotos > electores) {
    return { valid: false, error: 'La suma de votos excede el total de electores' };
  }

  return { valid: true, error: '' };
};

/**
 * Validate complete telegrama structure
 * @param {object} telegramaData - Telegrama data to validate
 * @returns {object} - {valid: boolean, errors: {field: message}}
 */
export const validateTelegrama = (telegramaData) => {
  const errors = {};

  // Validate mesa_id
  const mesaValidation = validateRequerido(telegramaData?.mesa_id);
  if (!mesaValidation.valid) {
    errors.mesa_id = mesaValidation.error;
  }

  // Validate usuario
  const usuarioValidation = validateRequerido(telegramaData?.usuario);
  if (!usuarioValidation.valid) {
    errors.usuario = usuarioValidation.error;
  }

  // Validate votos array
  const votosValidation = validateVotos(telegramaData?.votos, telegramaData?.electores);
  if (!votosValidation.valid) {
    errors.votos = votosValidation.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
