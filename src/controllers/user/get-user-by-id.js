import { ok, serverError } from '../helpers/http.js';
import { userNotFoundResponse } from '../helpers/user.js';
import { checkIfIdIsValid, invalidIdResponse } from '../helpers/validation.js';

export class GetUserByIdController {
  constructor(getUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase;
  }

  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.id;

      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const user = await this.getUserByIdUseCase.execute(userId);

      if (!user) {
        return userNotFoundResponse();
      }

      return ok(user);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
