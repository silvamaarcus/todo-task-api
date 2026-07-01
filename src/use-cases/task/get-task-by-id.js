import { TaskNotFoundError } from '../../errors/index.js';

export class GetTaskByIdUseCase {
  constructor(getTaskByIdRepository) {
    this.getTaskByIdRepository = getTaskByIdRepository;
  }

  async execute(taskId) {
    const taskAlreadyExists = await this.getTaskByIdRepository.execute(taskId);

    if (!taskAlreadyExists) {
      throw new TaskNotFoundError(taskId);
    }

    return taskAlreadyExists;
  }
}
