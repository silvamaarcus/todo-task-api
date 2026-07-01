import { createUserSchema } from '../../schemas/user.js';
import { badRequest, created, serverError } from '../helpers/http.js';

export class CreateUserController {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      const parsedParams = createUserSchema.safeParse(params);

      if (!parsedParams.success) {
        return badRequest({ message: parsedParams.error.issues[0].message });
      }

      const user = await this.createUserUseCase.execute(parsedParams.data);

      return created(user);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
