export class GetAllTasksUseCase {
  constructor(getAllTasksRepository) {
    this.getAllTasksRepository = getAllTasksRepository;
  }

  async execute(filter) {
    const tasks = await this.getAllTasksRepository.execute(filter);

    return tasks;
  }
}
