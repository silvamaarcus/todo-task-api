import { InvalidCredentialsError } from '../../errors/index.js';

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
      throw new InvalidCredentialsError(loginUserParams.email);
    }

    const comparePassword = await this.passwordComparatorAdapter.execute(
      loginUserParams.password,
      user.password,
    );

    if (!comparePassword) {
      throw new InvalidCredentialsError(loginUserParams.email);
    }

    const tokens = await this.tokensGeneratorAdapter.execute(user.id);

    return tokens;
  }
}
