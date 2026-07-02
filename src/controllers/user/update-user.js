import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors';
import { updateUserSchema } from '../../schemas/user.js';
import { badRequest, ok, serverError } from '../helpers/http.js';
import { userNotFoundResponse } from '../helpers/user';
import { checkIfIdIsValid, invalidIdResponse } from '../helpers/validation.js';

export class UpdateUserController {
  constructor(updateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase;
  }

  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.id;

      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const params = httpRequest.body;

      const parsedParams = updateUserSchema.safeParse(params);

      if (!parsedParams.success) {
        return badRequest({ message: parsedParams.error.issues[0].message });
      }

      const updateUser = await this.updateUserUseCase.execute(
        userId,
        parsedParams.data,
      );

      return ok(updateUser);
    } catch (error) {
      // Se ocorrer um erro específico para email já em uso
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }

      // Se ocorrer um erro específico para usuário não encontrado
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }
      console.error(error);
      return serverError();
    }
  }
}
