import { EmailAlreadyInUseError } from '../../errors/index.js';

export class CreateUserUseCase {
  constructor(
    getUserByEmailRepository,
    idGeneratorAdapter,
    passwordHasherAdapter,
    createUserRepository,
    tokensGeneratorAdapter,
  ) {
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.idGeneratorAdapter = idGeneratorAdapter;
    this.passwordHasherAdapter = passwordHasherAdapter;
    this.createUserRepository = createUserRepository;
    this.tokensGeneratorAdapter = tokensGeneratorAdapter;
  }

  async execute(createUserParams) {
    const userWithProvidedEmail = await this.getUserByEmailRepository.execute(
      createUserParams.email,
    );

    if (userWithProvidedEmail) {
      throw new EmailAlreadyInUseError(createUserParams.email);
    }

    const userId = this.idGeneratorAdapter.execute();

    const hashedPassword = await this.passwordHasherAdapter.execute(
      createUserParams.password,
    );

    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    };

    const createdUser = await this.createUserRepository.execute(user);

    return {
      ...createdUser,
      tokens: await this.tokensGeneratorAdapter.execute(userId),
    };
  }
}
