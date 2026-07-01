import { TaskNotFoundError } from '../../errors/index.js';
import { notFound, ok, serverError } from '../helpers/http.js';

export class DeleteTaskController {
  constructor(deleteTaskUseCase) {
    this.deleteTaskUseCase = deleteTaskUseCase;
  }

  async execute(httpRequest) {
    try {
      const taskId = httpRequest.params.id;

      const deleteTask = await this.deleteTaskUseCase.execute(taskId);

      return ok(deleteTask);
    } catch (error) {
      if (error instanceof TaskNotFoundError) {
        return notFound({ message: error.message });
      }
      return serverError();
    }
  }
}
