import { Router } from 'express';

import {
  makeCreateTaskController,
  makeDeleteTaskController,
  makeGetAllTasksController,
  makeGetTaskByIdController,
  makeUpdateTaskController,
} from '../factories/tasks.js';
import { auth } from '../middlewares/auth.js';

export const tasksRouter = Router();

// Rota p/ criar uma 'Task'
tasksRouter.post('/', auth, async (req, res) => {
  // Aciona a Factory
  const createTaskController = makeCreateTaskController();
  // Executa a Factory
  const { statusCode, body } = await createTaskController.execute({
    ...req,
    body: {
      ...req.body,
      user_id: req.userId, // sobrescreve com o userId do token
    },
  });
  // Retorna resposta p/ cliente c/ status e corpo da resposta
  res.status(statusCode).json(body);
});

// Rota p/ obter todas as 'Tasks' (com ou sem filtro de status)
tasksRouter.get('/', auth, async (req, res) => {
  const getAllTasksController = makeGetAllTasksController();

  const { statusCode, body } = await getAllTasksController.execute({
    ...req,
    body: {
      ...req.body,
      user_id: req.userId,
    },
  });

  res.status(statusCode).json(body);
});

// Rota p/ obter uma 'Task' por ID
tasksRouter.get('/:id', auth, async (req, res) => {
  const getTaskByIdController = makeGetTaskByIdController();

  const { statusCode, body } = await getTaskByIdController.execute({
    ...req,
    body: {
      ...req.body,
      user_id: req.userId,
    },
  });

  res.status(statusCode).json(body);
});

// Rota p/ atualizar uma 'Task' por ID
tasksRouter.patch('/:id', auth, async (req, res) => {
  const updateTaskController = makeUpdateTaskController();

  const { statusCode, body } = await updateTaskController.execute({
    ...req,
    body: {
      ...req.body,
      user_id: req.userId,
    },
  });

  res.status(statusCode).json(body);
});

// Rota p/ deletar uma 'Task' por ID
tasksRouter.delete('/:id', auth, async (req, res) => {
  const deleteTaskController = makeDeleteTaskController();

  const { statusCode, body } = await deleteTaskController.execute({
    ...req,
    body: {
      ...req.body,
      user_id: req.userId,
    },
  });

  res.status(statusCode).json(body);
});
