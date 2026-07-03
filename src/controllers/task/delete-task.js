import { TaskNotFoundError } from '../../errors/index.js';
import { notFound, ok, serverError } from '../helpers/http.js';

export class DeleteTaskController {
  constructor(deleteTaskUseCase) {
    this.deleteTaskUseCase = deleteTaskUseCase;
  }

  async execute(httpRequest) {
    try {
      const taskId = httpRequest.params.id;

      const userId = httpRequest.body.user_id;

      if (!userId) {
        return notFound({ message: 'O user_id é obrigátorio.' });
      }

      const deleteTask = await this.deleteTaskUseCase.execute(taskId, userId);

      return ok(deleteTask);
    } catch (error) {
      if (error instanceof TaskNotFoundError) {
        return notFound({ message: error.message });
      }
      return serverError();
    }
  }
}
