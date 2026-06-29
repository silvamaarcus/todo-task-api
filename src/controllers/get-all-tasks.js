import { TASK_TYPE } from '../constants/index.js';
import { badRequest, ok, serverError } from './helpers/http.js';

export class GetAllTasksController {
  constructor(getAllTasksTaskUseCase) {
    this.getAllTasksTaskUseCase = getAllTasksTaskUseCase;
  }

  async execute(httpRequest) {
    try {
      const { status } = httpRequest.query || {};

      if (
        status &&
        status !== TASK_TYPE.TODO &&
        status !== TASK_TYPE.IN_PROGRESS &&
        status !== TASK_TYPE.DONE
      ) {
        return badRequest({
          message: `Status inválido! Escolha: ${TASK_TYPE.TODO}, ${TASK_TYPE.IN_PROGRESS} ou ${TASK_TYPE.DONE}`,
        });
      }

      const tasks = await this.getAllTasksTaskUseCase.execute({ status });

      return ok(tasks);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
