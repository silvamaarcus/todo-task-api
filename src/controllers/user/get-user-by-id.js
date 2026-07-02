import { ok, serverError } from '../helpers/http.js';
import { userNotFoundResponse } from '../helpers/user.js';
import { invalidIdResponse } from '../helpers/validation.js';

export class GetUserByIdController {
  constructor(getUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase;
  }

  async execute(httpRequest) {
    try {
      const idIsValid = httpRequest.params.userId;

      if (!idIsValid) {
        return invalidIdResponse();
      }

      const user = await this.getUserByIdUseCase.execute(idIsValid);

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
