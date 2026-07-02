import { UserNotFoundError } from '../../errors/index.js';
import { user } from '../../tests/fixtures/users.js';
import { DeleteUserController } from './delete-user.js';

describe('DeleteUserController', () => {
  class DeleteUserUseCaseStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const deleteUserUseCaseStub = new DeleteUserUseCaseStub();
    const sut = new DeleteUserController(deleteUserUseCaseStub);

    return {
      deleteUserUseCaseStub,
      sut,
    };
  };

  const httpRequest = {
    params: {
      id: user.id,
    },
    body: user,
  };

  test('Deve retornar 200 quando um usuário for deletado com sucesso', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });

  test('Deve retornar 400 quando um ID não for válido', async () => {
    const { sut } = makeSut();

    const invalidHttpRequest = {
      params: {
        id: 'invalid-id',
      },
    };

    const result = await sut.execute(invalidHttpRequest);

    expect(result.statusCode).toBe(400);
  });

  test('Deve retornar 404 quando usuário não for encontrado', async () => {
    const { sut, deleteUserUseCaseStub } = makeSut();

    import.meta.jest
      .spyOn(deleteUserUseCaseStub, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError()); // Forçar erro no metódo execute

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(404);
  });

  test('Deve retornar 500 quando ocorrer erro interno no servidor', async () => {
    const { sut, deleteUserUseCaseStub } = makeSut();
    import.meta.jest
      .spyOn(deleteUserUseCaseStub, 'execute')
      .mockRejectedValueOnce(new Error());

    const result = await sut.execute({
      params: {
        id: user.id,
      },
    });

    expect(result.statusCode).toBe(500);
  });
});
