import { TaskNotFoundError } from '../errors/index.js';
import { updateTaskSchema } from '../schemas/task.js';
import { badRequest, created, notFound, serverError } from './helpers/http.js';

export class UpdateTaskController {
  constructor(updateTaskUseCase) {
    this.updateTaskUseCase = updateTaskUseCase;
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      const parsedParams = updateTaskSchema.safeParse(params);

      if (!parsedParams.success) {
        return badRequest({ message: parsedParams.error.issues[0].message });
      }

      const taskId = httpRequest.params.id;

      const updateTask = await this.updateTaskUseCase.execute(
        taskId,
        parsedParams.data,
      );

      return created(updateTask);
    } catch (error) {
      if (error instanceof TaskNotFoundError) {
        return notFound({ message: error.message });
      }
      return serverError();
    }
  }
}
