import {
  EmailAlreadyInUseError,
  UserNotFoundError,
} from '../../errors/index.js';
import { user } from '../../tests/fixtures/users.js';
import { UpdateUserController } from './update-user.js';

describe('UpdateUserController', () => {
  class UpdateUserUseCaseStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const updateUserUseCaseStub = new UpdateUserUseCaseStub();
    const sut = new UpdateUserController(updateUserUseCaseStub);

    return {
      sut,
      updateUserUseCaseStub,
    };
  };

  const httpRequest = {
    params: {
      id: user.id,
    },
    body: user,
  };

  test('Deve retornar 200 quando um usuário for atualizado com sucesso', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(httpRequest.body);
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

  test('Deve retornar 400 quando parametros incorretos', async () => {
    const { sut } = makeSut();

    const invalidHttpRequest = {
      params: {
        id: user.id,
      },
      body: {
        email: 'invalid-email',
        password: '123',
      },
    };

    const result = await sut.execute(invalidHttpRequest);

    expect(result.statusCode).toBe(400);
  });

  test('Deve retornar 400 quando ocorrer erro EmailAlreadyInUseError', async () => {
    const { sut, updateUserUseCaseStub } = makeSut();
    import.meta.jest
      .spyOn(updateUserUseCaseStub, 'execute')
      .mockRejectedValueOnce(new EmailAlreadyInUseError('email@aws.com'));
    const httpRequestAlt = {
      params: {
        id: user.id,
      },
      body: { ...user, email: 'email@aws.com' },
    };

    const result = await sut.execute(httpRequestAlt);

    expect(result.statusCode).toBe(400);
  });

  test('Deve retornar 404 quando ocorrer erro UserNotFoundError', async () => {
    const { sut, updateUserUseCaseStub } = makeSut();
    import.meta.jest
      .spyOn(updateUserUseCaseStub, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError('email@aws.com'));

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(404);
  });

  test('Deve retornar 500 quando ocorrer erro interno no servidor', async () => {
    const { sut, updateUserUseCaseStub } = makeSut();
    import.meta.jest
      .spyOn(updateUserUseCaseStub, 'execute')
      .mockRejectedValueOnce(new Error());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
