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
    };

    const createdTask = await this.createTaskRepository.execute(task);

    return createdTask;
  }
}
