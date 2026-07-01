import { UserNotFoundError } from '../../errors';
import { user } from '../../tests/fixtures/users.js';
import { DeleteUserUseCase } from './delete-user.js';

describe('DeleteUserUseCase', () => {
  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  class DeleteUserRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub();
    const deleteUserRepositoryStub = new DeleteUserRepositoryStub();

    const sut = new DeleteUserUseCase(
      getUserByIdRepositoryStub,
      deleteUserRepositoryStub,
    );

    return {
      sut,
      getUserByIdRepositoryStub,
      deleteUserRepositoryStub,
    };
  };

  test('Deve deletar um usuário existente', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(user.id);

    expect(result).toEqual(user);
  });

  test('Deve lançar uma exceção se o usuário não existir', async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut();
    import.meta.jest
      .spyOn(getUserByIdRepositoryStub, 'execute')
      .mockResolvedValueOnce(null); // Simula que o usuário não existe

    const promise = sut.execute(user.id);

    await expect(promise).rejects.toThrow(new UserNotFoundError(user.id));
  });
});
