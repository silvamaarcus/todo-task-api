import validator from 'validator';

import { badRequest } from './http.js';

// Verifica se o ID é um UUID válido
export const checkIfIdIsValid = (id) => validator.isUUID(id);

// Retorna uma resposta de erro para ID inválido
export const invalidIdResponse = () => {
  return badRequest({
    message: 'ID inválido. Tente novamente.',
  });
};

// Retorna uma resposta de erro para campos obrigatórios ausentes
export const requiredFieldsMissingResponse = (field) => {
  return badRequest({
    message: `O campo "${field}" é obrigatório. Por favor, forneça um valor válido.`,
  });
};
