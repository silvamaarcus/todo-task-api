import { InvalidPasswordError, UserNotFoundError } from '../../errors/index.js';

export class LoginUserUseCase {
  constructor(
    getUserByEmailRepository,
    passwordComparatorAdapter,
    tokensGeneratorAdapter,
  ) {
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.passwordComparatorAdapter = passwordComparatorAdapter;
    this.tokensGeneratorAdapter = tokensGeneratorAdapter;
  }
  async execute(loginUserParams) {
    const user = await this.getUserByEmailRepository.execute(
      loginUserParams.email,
    );

    if (!user) {
      throw new UserNotFoundError(loginUserParams.email);
    }

    const isPasswordCorrect = await this.passwordComparatorAdapter.execute(
      loginUserParams.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new InvalidPasswordError();
    }

    const tokens = await this.tokensGeneratorAdapter.execute(user.id);

    return { ...user, tokens };
  }
}
