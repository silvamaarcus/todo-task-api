import { ok, serverError } from './helpers/http.js';

export class GetAllTasksController {
  constructor(getAllTasksTaskUseCase) {
    this.getAllTasksTaskUseCase = getAllTasksTaskUseCase;
  }

  async execute() {
    try {
      const tasks = await this.getAllTasksTaskUseCase.execute();

      return ok(tasks);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
