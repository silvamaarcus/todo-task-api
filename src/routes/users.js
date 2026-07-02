import { Router } from 'express';

import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserByIdController,
  makeUpdateUserController,
} from '../factories/users.js';

export const usersRouter = Router();

// Rota p/ criar um 'User'
usersRouter.post('/', async (req, res) => {
  // Aciona a Factory
  const createUserController = makeCreateUserController();
  // Executa a Factory
  const { statusCode, body } = await createUserController.execute(req);
  // Retorna resposta p/ cliente c/ status e corpo da resposta
  res.status(statusCode).json(body);
});

// Rota p/ obter um 'User' por ID
usersRouter.get('/:id', async (req, res) => {
  const getUserByIdController = makeGetUserByIdController();

  const { statusCode, body } = await getUserByIdController.execute(req);

  res.status(statusCode).json(body);
});

// Rota p/ atualizar um 'User' por ID
usersRouter.patch('/:id', async (req, res) => {
  const updateUserController = makeUpdateUserController();

  const { statusCode, body } = await updateUserController.execute(req);

  res.status(statusCode).json(body);
});

// Rota p/ deletar um 'User' por ID
usersRouter.delete('/:id', async (req, res) => {
  const deleteUserController = makeDeleteUserController();

  const { statusCode, body } = await deleteUserController.execute(req);

  res.status(statusCode).json(body);
});
