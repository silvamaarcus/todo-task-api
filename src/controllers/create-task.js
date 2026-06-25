import { createTaskSchema } from '../schemas/task.js';
import { badRequest, created, serverError } from './helpers/http.js';

export class CreateTaskController {
  constructor(createTaskUseCase) {
    this.createTaskUseCase = createTaskUseCase;
  }

  async execute(httpRequest) {
    try {
      // Obtém o body da requisição
      const params = httpRequest.body;

      // Valida os dados do body com Zod
      const parsedParams = createTaskSchema.safeParse(params);

      if (!parsedParams.success) {
        return badRequest({ message: parsedParams.error.errors[0].message });
      }

      // Aplica regra de negócio nos dados validados (parsedParams)
      const task = await this.createTaskUseCase.execute(parsedParams.data);

      // Retorna sucesso com task criada
      return created(task);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
