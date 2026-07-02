import { user } from '../../tests/fixtures/users.js';
import { GetUserByIdUseCase } from './get-user-by-id.js';

describe('GetUserByIdUseCase', () => {
  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub();
    const sut = new GetUserByIdUseCase(getUserByIdRepositoryStub);

    return {
      getUserByIdRepositoryStub,
      sut,
    };
  };

  test('Deve retornar um usuário quando o ID for válido', async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut();

    import.meta.jest
      .spyOn(getUserByIdRepositoryStub, 'execute')
      .mockResolvedValueOnce(user);

    const result = await sut.execute(user.id);

    expect(result).toEqual(user);
  });
});
