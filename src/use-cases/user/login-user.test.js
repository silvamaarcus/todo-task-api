import { InvalidPasswordError, UserNotFoundError } from '../../errors/index.js';
import { user } from '../../tests/fixtures/users.js';
import { LoginUserUseCase } from './login-user.js';

describe('LoginUserUseCase', () => {
  class GetUserByEmailRepositoryStub {
    async execute() {
      return user; // Retorna o usuário de teste
    }
  }

  class PasswordComparatorAdapterStub {
    async execute() {
      return true; // Senha correta
    }
  }

  class TokensGeneratorAdapterStub {
    async execute() {
      return {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
    }
  }

  const makeSut = () => {
    const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub();
    const passwordComparatorAdapterStub = new PasswordComparatorAdapterStub();
    const tokensGeneratorAdapterStub = new TokensGeneratorAdapterStub();

    const sut = new LoginUserUseCase(
      getUserByEmailRepositoryStub,
      passwordComparatorAdapterStub,
      tokensGeneratorAdapterStub,
    );

    return {
      sut,
      getUserByEmailRepositoryStub,
      passwordComparatorAdapterStub,
      tokensGeneratorAdapterStub,
    };
  };

  test('Deve retornar o usuário com tokens', async () => {
    const { sut } = makeSut();
    const loginParams = {
      email: user.email,
      password: 'password',
    };

    const result = await sut.execute(loginParams);

    expect(result).toBeDefined();
    expect(result.id).toBe(user.id);
    expect(result.email).toBe(user.email);
    expect(result.tokens).toBeDefined();
    expect(result.tokens.accessToken).toBe('access-token');
    expect(result.tokens.refreshToken).toBe('refresh-token');
  });

  test('Deve lançar UserNotFoundError caso o usuário não seja encontrado', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    import.meta.jest
      .spyOn(getUserByEmailRepositoryStub, 'execute')
      .mockResolvedValueOnce(null); // Simula usuário não encontrado

    const loginParams = {
      email: '',
      password: '',
    };

    const promise = sut.execute(loginParams);

    await expect(promise).rejects.toThrow(
      new UserNotFoundError(loginParams.email),
    );
  });

  test('Deve lançar InvalidPasswordError caso a senha inválida', async () => {
    const { sut, passwordComparatorAdapterStub } = makeSut();
    import.meta.jest
      .spyOn(passwordComparatorAdapterStub, 'execute')
      .mockResolvedValueOnce(false); // Simula senha inválida

    const loginParams = {
      email: user.email,
      password: 'wrong-password',
    };

    const promise = sut.execute(loginParams);

    await expect(promise).rejects.toThrow(new InvalidPasswordError());
  });
});
