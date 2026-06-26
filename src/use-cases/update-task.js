import { TaskNotFoundError } from '../errors/index.js';

export class UpdateTaskUseCase {
  constructor(getTaskByIdRepository, updateTaskRepository) {
    this.getTaskByIdRepository = getTaskByIdRepository;
    this.updateTaskRepository = updateTaskRepository;
  }

  async execute(taskId, updateTaskParams) {
    const taskAlreadyExists = await this.getTaskByIdRepository.execute(taskId);

    if (!taskAlreadyExists) {
      throw new TaskNotFoundError(taskId);
    }

    const updateTask = await this.updateTaskRepository.execute(
      taskId,
      updateTaskParams,
    );

    return updateTask;
  }
}
