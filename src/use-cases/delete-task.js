import { TaskNotFoundError } from '../errors/index.js';

export class DeleteTaskUseCase {
  constructor(getTaskByIdRepository, deleteTaskRepository) {
    this.getTaskByIdRepository = getTaskByIdRepository;
    this.deleteTaskRepository = deleteTaskRepository;
  }

  async execute(taskId) {
    const taskAlreadyExists = await this.getTaskByIdRepository.execute(taskId);

    if (!taskAlreadyExists) {
      throw new TaskNotFoundError(taskId);
    }

    const deleteTask = await this.deleteTaskRepository.execute(taskId);

    return deleteTask;
  }
}
