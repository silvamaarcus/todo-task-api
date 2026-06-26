import {
  CreateTaskController,
  DeleteTaskController,
  GetAllTasksController,
  GetTaskByIdController,
  UpdateTaskController,
} from '../controllers/index.js';
import {
  CreateTaskRepository,
  DeleteTaskRepository,
  GetAllTasksRepository,
  GetTaskByIdRepository,
  UpdateTaskRepository,
} from '../repositories/postgres/index.js';
import {
  CreateTaskUseCase,
  DeleteTaskUseCase,
  GetAllTasksUseCase,
  GetTaskByIdUseCase,
  UpdateTaskUseCase,
} from '../use-cases/index.js';

// * Forma de ler: Repository (Banco de Dados) -> UseCase (Regra de Negócio) -> Controller (Requisição HTTP)

// Factory c/ injeção de dependência p/ criar uma 'Task'
export const makeCreateTaskController = () => {
  // 1. Salva a 'Task' no banco de dados
  const createTaskRepository = new CreateTaskRepository();
  // 2. Aplica a regra de negócio p/ criar uma 'Task'
  const createTaskUseCase = new CreateTaskUseCase(createTaskRepository);
  // 3. Recebe a requisição p/ criar uma 'Task' e retorna a resposta
  return new CreateTaskController(createTaskUseCase);
};

// Factory c/ injeção de dependência p/ obter todas as 'Tasks'
export const makeGetAllTasksController = () => {
  // 1. Busca todas as 'Tasks' no banco de dados
  const getAllTasksRepository = new GetAllTasksRepository();
  // 2. Aplica a regra de negócio p/ obter todas as 'Tasks'
  const getAllTasksUseCase = new GetAllTasksUseCase(getAllTasksRepository);
  // 3. Recebe a requisição p/ obter todas as 'Tasks' e retorna a resposta
  return new GetAllTasksController(getAllTasksUseCase);
};

// Factory c/ injeção de dependência p/ obter uma 'Task' por ID
export const makeGetTaskByIdController = () => {
  // 1. Busca a 'Task' pelo ID no banco de dados
  const getTaskByIdRepository = new GetTaskByIdRepository();
  // 2. Aplica a regra de negócio p/ obter a 'Task' pelo ID
  const getTaskByIdUseCase = new GetTaskByIdUseCase(getTaskByIdRepository);
  // 3. Recebe a requisição p/ obter todas a 'Task'  pelo ID e retorna a resposta
  return new GetTaskByIdController(getTaskByIdUseCase);
};

// Factory c/ injeção de dependência p/ atualizar uma 'Task'
export const makeUpdateTaskController = () => {
  // 1. Atualiza a 'Task' no banco de dados
  const getTaskByIdRepository = new GetTaskByIdRepository(); // ID da 'Task'
  const updateTaskRepository = new UpdateTaskRepository(); // Dados da 'Task'
  // 2. Aplica a regra de negócio p/ atualizar uma 'Task'
  const updateTaskUseCase = new UpdateTaskUseCase(
    getTaskByIdRepository,
    updateTaskRepository,
  );
  // 3. Recebe a requisição p/ atualizar uma 'Task' e retorna a resposta
  return new UpdateTaskController(updateTaskUseCase);
};

// Factory c/ injeção de dependência p/ deletar uma 'Task'
export const makeDeleteTaskController = () => {
  // 1. Apaga a 'Task' no banco de dados
  const getTaskByIdRepository = new GetTaskByIdRepository(); // ID da 'Task'
  const deleteTaskRepository = new DeleteTaskRepository(); // Dados da 'Task'
  // 2. Aplica a regra de negócio p/ deletar uma 'Task'
  const updateTaskUseCase = new DeleteTaskUseCase(
    getTaskByIdRepository,
    deleteTaskRepository,
  );
  // 3. Recebe a requisição p/ deletar uma 'Task' e retorna a resposta
  return new DeleteTaskController(updateTaskUseCase);
};
