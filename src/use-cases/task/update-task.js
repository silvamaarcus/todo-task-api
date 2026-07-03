import { TaskNotFoundError } from '../../errors/index.js';

export class UpdateTaskUseCase {
  constructor(getTaskByIdRepository, updateTaskRepository) {
    this.getTaskByIdRepository = getTaskByIdRepository;
    this.updateTaskRepository = updateTaskRepository;
  }

  async execute(taskId, userId, updateTaskParams) {
    const taskAlreadyExists = await this.getTaskByIdRepository.execute(taskId);

    if (!taskAlreadyExists) {
      throw new TaskNotFoundError(taskId);
    }

    // Verifica se a task pertence ao usuário que está tentando acessá-la
    if (taskAlreadyExists.user_id !== userId) {
      throw new TaskNotFoundError(taskId); // não revelamos que a task existe
    }

    const updateTask = await this.updateTaskRepository.execute(
      taskId,
      userId,
      updateTaskParams,
    );

    return updateTask;
  }
}
