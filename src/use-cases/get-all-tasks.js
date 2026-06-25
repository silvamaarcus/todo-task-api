export class GetAllTasksUseCase {
  constructor(getAllTasksRepository) {
    this.getAllTasksRepository = getAllTasksRepository;
  }

  async execute() {
    const tasks = await this.getAllTasksRepository.execute();

    return tasks;
  }
}
