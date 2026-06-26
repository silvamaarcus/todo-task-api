import { TASK_TYPE } from '../constants';

export class CreateTaskUseCase {
  constructor(idGeneratorAdapter, createTaskRepository) {
    this.idGeneratorAdapter = idGeneratorAdapter;
    this.createTaskRepository = createTaskRepository;
  }

  async execute(createTaskParams) {
    const taskId = await this.idGeneratorAdapter.execute();

    const task = {
      ...createTaskParams,
      id: taskId,
      status: TASK_TYPE.TODO,
    };

    const createdTask = await this.createTaskRepository.execute(task);

    return createdTask;
  }
}
