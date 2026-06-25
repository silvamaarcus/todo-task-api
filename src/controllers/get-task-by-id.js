import { TaskNotFoundError } from '../errors/index.js';
import { created, notFound, serverError } from './helpers/http.js';

export class GetTaskByIdController {
  constructor(getTaskByIdUseCase) {
    this.getTaskByIdUseCase = getTaskByIdUseCase;
  }

  async execute(httpRequest) {
    try {
      const taskId = httpRequest.params.id; // Obtém o ID da tarefa a partir dos parâmetros da requisição na URL

      const task = await this.getTaskByIdUseCase.execute(taskId);

      return created(task);
    } catch (error) {
      if (error instanceof TaskNotFoundError) {
        return notFound({ message: error.message });
      }

      return serverError();
    }
  }
}
