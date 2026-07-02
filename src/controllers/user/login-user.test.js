import { InvalidPasswordError } from '../../errors/index.js';
import { user } from '../../tests/fixtures/users.js';
import { LoginUserController } from './login-user.js';

describe('LoginUserController', () => {
  class LoginUserUseCaseStub {
    async execute() {
      return {
        ...user,
        tokens: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      };
    }
  }

  const makeSut = () => {
    const loginUserUseCaseStub = new LoginUserUseCaseStub();
    const sut = new LoginUserController(loginUserUseCaseStub);

    return {
      sut,
      loginUserUseCaseStub,
    };
  };

  const httpRequest = {
    body: {
      email: user.email,
      password: user.password,
    },
  };

  test('Deve retornar 200 quando o login for bem-sucedido', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body.tokens).toHaveProperty('accessToken');
    expect(result.body.tokens).toHaveProperty('refreshToken');
  });

  test('Deve retornar 400 quando os parâmetros de login forem inválidos', async () => {
    const { sut } = makeSut();

    const invalidHttpRequest = {
      body: {
        email: 'invalid-email',
        password: '123',
      },
    };

    const result = await sut.execute(invalidHttpRequest);

    expect(result.statusCode).toBe(400);
  });

  test('Deve retornar 401 quando as credenciais de login forem inválidas', async () => {
    const { sut, loginUserUseCaseStub } = makeSut();

    import.meta.jest
      .spyOn(loginUserUseCaseStub, 'execute')
      .mockRejectedValueOnce(new InvalidPasswordError());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(401);
  });

  test('Deve retornar 500 quando ocorrer um erro interno no servidor', async () => {
    const { sut, loginUserUseCaseStub } = makeSut();

    import.meta.jest
      .spyOn(loginUserUseCaseStub, 'execute')
      .mockRejectedValueOnce(new Error('Internal server error'));

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
