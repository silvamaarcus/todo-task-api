import { EmailAlreadyInUseError } from '../../errors/index.js';

export class CreateUserUseCase {
  constructor(
    getUserByEmailRepository,
    idGeneratorAdapter,
    passwordHasherAdapter,
    createUserRepository,
  ) {
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.idGeneratorAdapter = idGeneratorAdapter;
    this.passwordHasherAdapter = passwordHasherAdapter;
    this.createUserRepository = createUserRepository;
  }

  async execute(createUserParams) {
    const userAlreadyExists = await this.getUserByEmailRepository.execute(
      createUserParams.email,
    );

    if (userAlreadyExists) {
      throw new EmailAlreadyInUseError(createUserParams.email);
    }

    const userId = await this.idGeneratorAdapter.execute();

    const hashedPassword = await this.passwordHasherAdapter.execute(
      createUserParams.password,
    );

    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    };

    const createdUser = await this.createUserRepository.execute(user);

    return createdUser;
  }
}
