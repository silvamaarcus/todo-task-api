import { TaskNotFoundError } from '../../errors/index.js';

export class DeleteTaskUseCase {
  constructor(getTaskByIdRepository, deleteTaskRepository) {
    this.getTaskByIdRepository = getTaskByIdRepository;
    this.deleteTaskRepository = deleteTaskRepository;
  }

  async execute(taskId, userId) {
    const taskAlreadyExists = await this.getTaskByIdRepository.execute(taskId);

    if (!taskAlreadyExists) {
      throw new TaskNotFoundError(taskId);
    }

    // Verifica se a task pertence ao usuário que está tentando acessá-la
    if (taskAlreadyExists.user_id !== userId) {
      throw new TaskNotFoundError(taskId); // não revelamos que a task existe
    }

    const deleteTask = await this.deleteTaskRepository.execute(taskId);

    return deleteTask;
  }
}
