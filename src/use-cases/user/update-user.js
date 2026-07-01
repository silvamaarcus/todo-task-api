import { UserNotFoundError } from '../../errors/index.js';

export class UpdateUserUseCase {
  constructor(
    getUserByEmailRepository,
    passwordHasherAdapter,
    updateUserRepository,
  ) {
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.passwordHasherAdapter = passwordHasherAdapter;
    this.updateUserRepository = updateUserRepository;
  }

  async execute(userId, updateUserParams) {
    //* ATUALIZAÇÃO DE EMAIL

    // Verifica se o usuário existe antes de atualizar
    if (updateUserParams.email) {
      //Obtém usuário pelo email fornecido
      const userWithProvidedEmail = await this.getUserByEmailRepository.execute(
        updateUserParams.email,
      );

      // Se o email fornecido pertence a outro usuário, lança uma exceção
      if (
        userWithProvidedEmail &&
        userWithProvidedEmail.id !== updateUserParams.id
      ) {
        throw new UserNotFoundError(updateUserParams.email);
      }
    }
    const user = {
      ...updateUserParams,
    };

    //* ATUALIZAÇÃO DE SENHA

    // Se uma nova senha for fornecida, ela será criptografada antes de atualizar o usuário
    if (updateUserParams.password) {
      // Obtem a senha criptografada usando o adaptador de hash de senha
      const hashedPassword = await this.passwordHasherAdapter.execute(
        updateUserParams.password,
      );

      user.password = hashedPassword; // Atualiza a senha do usuário com a nova senha criptografada
    }

    const updatedUser = await this.updateUserRepository.execute(userId, user);

    return updatedUser;
  }
}
