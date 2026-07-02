import { notFound } from './http.js';

export const userNotFoundResponse = () =>
  notFound({ message: 'Usuário não encontrado.' });
