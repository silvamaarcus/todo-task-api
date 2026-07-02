import { user } from '../../tests/fixtures/users.js';
import { GetUserByIdController } from './get-user-by-id.js';

describe('GetUserByIdController', () => {
  class GetUserByIdUseCaseStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getUserByIdUseCaseStub = new GetUserByIdUseCaseStub();
    const sut = new GetUserByIdController(getUserByIdUseCaseStub);

    return {
      getUserByIdUseCaseStub,
      sut,
    };
  };

  const httpRequest = {
    params: {
      userId: user.id,
    },
  };

  test('Deve retornar 200 quando um usuário for encontrado com sucesso', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(user);
  });

  test('Deve retornar 400 quando um ID não for válido', async () => {
    const { sut, getUserByIdUseCaseStub } = makeSut();
    import.meta.jest
      .spyOn(getUserByIdUseCaseStub, 'execute')
      .mockResolvedValueOnce(user);

    const promise = await sut.execute({
      params: {
        userId: null,
      },
    });

    expect(promise.statusCode).toBe(400);
  });

  test('Deve retornar 404 quando um usuário não for encontrado', async () => {
    const { sut, getUserByIdUseCaseStub } = makeSut();
    import.meta.jest
      .spyOn(getUserByIdUseCaseStub, 'execute')
      .mockResolvedValueOnce(null);

    const promise = await sut.execute(httpRequest);

    expect(promise.statusCode).toBe(404);
  });

  test('Deve retornar 500 quando ocorrer erro interno no servidor', async () => {
    const { sut, getUserByIdUseCaseStub } = makeSut();
    import.meta.jest
      .spyOn(getUserByIdUseCaseStub, 'execute')
      .mockRejectedValueOnce(new Error());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
