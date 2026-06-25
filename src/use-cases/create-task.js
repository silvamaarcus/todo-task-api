import { v4 as uuidv4 } from 'uuid';

export class CreateTaskUseCase {
  constructor(createTaskRepository) {
    this.createTaskRepository = createTaskRepository;
  }

  async execute(createTaskParams) {
    const taskId = uuidv4();

    const task = {
      ...createTaskParams,
      id: taskId,
    };

    const createdTask = await this.createTaskRepository.execute(task);

    return createdTask;
  }
}
