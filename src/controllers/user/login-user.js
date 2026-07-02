import { InvalidPasswordError, UserNotFoundError } from '../../errors/index.js';
import { loginUserSchema } from '../../schemas/user.js';
import {
  badRequest,
  notFound,
  ok,
  serverError,
  unauthorized,
} from '../helpers/http.js';

export class LoginUserController {
  constructor(loginUserUseCase) {
    this.loginUserUseCase = loginUserUseCase;
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      const parsedParams = loginUserSchema.safeParse(params);

      if (!parsedParams.success) {
        return badRequest({ message: parsedParams.error.issues[0].message });
      }

      const user = await this.loginUserUseCase.execute(parsedParams.data);

      return ok(user);
    } catch (error) {
      // Se o erro for de senha inválida, retorna 401 Unauthorized
      if (error instanceof InvalidPasswordError) {
        return unauthorized();
      }

      // Se o erro for de usuário não encontrado, retorna 404 Not Found
      if (error instanceof UserNotFoundError) {
        return notFound({
          message: 'Usuário não encontrado.',
        });
      }
      console.error(error);
      return serverError();
    }
  }
}
