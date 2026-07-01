import { UserNotFoundError } from '../../errors/index.js';

export class DeleteUserUseCase {
  constructor(getUserByIdRepository, deleteUserRepository) {
    this.getUserByIdRepository = getUserByIdRepository;
    this.deleteUserRepository = deleteUserRepository;
  }

  async execute(userId) {
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const deletedUser = await this.deleteUserRepository.execute(userId);

    return deletedUser;
  }
}
