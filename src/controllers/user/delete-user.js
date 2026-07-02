import { UserNotFoundError } from '../../errors/index.js';
import { notFound, ok, serverError } from '../helpers/http.js';
import { checkIfIdIsValid, invalidIdResponse } from '../helpers/validation.js';

export class DeleteUserController {
  constructor(deleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase;
  }

  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.id;

      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const deleteUSer = await this.deleteUserUseCase.execute(userId);

      return ok(deleteUSer);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return notFound({ message: error.message });
      }

      return serverError();
    }
  }
}
