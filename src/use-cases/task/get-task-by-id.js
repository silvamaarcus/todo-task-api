import { TaskNotFoundError } from '../../errors/index.js';

export class GetTaskByIdUseCase {
  constructor(getTaskByIdRepository) {
    this.getTaskByIdRepository = getTaskByIdRepository;
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

    return taskAlreadyExists;
  }
}
