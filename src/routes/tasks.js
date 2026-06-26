import { Router } from 'express';

import {
  makeCreateTaskController,
  makeDeleteTaskController,
  makeGetAllTasksController,
  makeGetTaskByIdController,
  makeUpdateTaskController,
} from '../factories/tasks.js';

export const tasksRouter = Router();

// Rota p/ criar uma 'Task'
tasksRouter.post('/', async (req, res) => {
  // Aciona a Factory
  const createTaskController = makeCreateTaskController();
  // Executa a Factory
  const { statusCode, body } = await createTaskController.execute(req);
  // Retorna resposta p/ cliente c/ status e corpo da resposta
  res.status(statusCode).json(body);
});

// Rota p/ obter todas as 'Tasks'
tasksRouter.get('/', async (req, res) => {
  // Aciona a Factory
  const getAllTasksController = makeGetAllTasksController();
  // Executa a Factory
  const { statusCode, body } = await getAllTasksController.execute(req);
  // Retorna resposta p/ cliente c/ status e corpo da resposta
  res.status(statusCode).json(body);
});

// Rota p/ obter uma 'Task' por ID
tasksRouter.get('/:id', async (req, res) => {
  // Aciona a Factory
  const getTaskByIdController = makeGetTaskByIdController();
  // Executa a Factory
  const { statusCode, body } = await getTaskByIdController.execute(req);
  // Retorna resposta p/ cliente c/ status e corpo da resposta
  res.status(statusCode).json(body);
});

// Rota p/ atualizar uma 'Task' por ID
tasksRouter.patch('/:id', async (req, res) => {
  // Aciona a Factory
  const updateTaskController = makeUpdateTaskController();
  // Executa a Factory
  const { statusCode, body } = await updateTaskController.execute(req);
  // Retorna resposta p/ cliente c/ status e corpo da resposta
  res.status(statusCode).json(body);
});

// Rota p/ deletar uma 'Task' por ID
tasksRouter.delete('/:id', async (req, res) => {
  // Aciona a Factory
  const deleteTaskController = makeDeleteTaskController();
  // Executa a Factory
  const { statusCode, body } = await deleteTaskController.execute(req);
  // Retorna resposta p/ cliente c/ status e corpo da resposta
  res.status(statusCode).json(body);
});
