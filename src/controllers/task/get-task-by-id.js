import { TaskNotFoundError } from '../../errors/index.js';
import { badRequest, notFound, ok, serverError } from '../helpers/http.js';

export class GetTaskByIdController {
  constructor(getTaskByIdUseCase) {
    this.getTaskByIdUseCase = getTaskByIdUseCase;
  }

  async execute(httpRequest) {
    try {
      const taskId = httpRequest.params.id;

      const userId = httpRequest.body.user_id;

      if (!userId) {
        return badRequest({
          message: 'O user_id é obrigatório!',
        });
      }

      const task = await this.getTaskByIdUseCase.execute(taskId, userId);

      return ok(task);
    } catch (error) {
      if (error instanceof TaskNotFoundError) {
        return notFound({ message: error.message });
      }

      return serverError();
    }
  }
}
