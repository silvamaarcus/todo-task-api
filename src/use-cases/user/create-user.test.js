import { faker } from '@faker-js/faker';

import { EmailAlreadyInUseError } from '../../errors/index.js';
import { user } from '../../tests/fixtures/users.js';
import { CreateUserUseCase } from './create-user';

describe('CreateUserUseCase', () => {
  class GetUserByEmailRepositoryStub {
    async execute() {
      return null; // Email não está em uso
    }
  }

  class IdGeneratorAdapterStub {
    execute() {
      return faker.string.uuid(); // Gera um ID aleatório
    }
  }

  class PasswordHasherAdapterStub {
    async execute() {
      return faker.string.alphanumeric(20); // Gera uma senha aleatória
    }
  }

  class CreateUserRepositoryStub {
    async execute() {
      return user;
    }
  }

  class TokensGeneratorAdapterStub {
    async execute() {
      return {
        accessToken: faker.string.alphanumeric(20),
        refreshToken: faker.string.alphanumeric(20),
      };
    }
  }

  const makeSut = () => {
    const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub();
    const idGeneratorAdapterStub = new IdGeneratorAdapterStub();
    const passwordHasherAdapterStub = new PasswordHasherAdapterStub();
    const createUserRepositoryStub = new CreateUserRepositoryStub();
    const tokensGeneratorAdapterStub = new TokensGeneratorAdapterStub();

    const sut = new CreateUserUseCase(
      getUserByEmailRepositoryStub,
      idGeneratorAdapterStub,
      passwordHasherAdapterStub,
      createUserRepositoryStub,
      tokensGeneratorAdapterStub,
    );

    return {
      sut,
      getUserByEmailRepositoryStub,
      idGeneratorAdapterStub,
      passwordHasherAdapterStub,
      createUserRepositoryStub,
      tokensGeneratorAdapterStub,
    };
  };

  test('Deve garantir que o usuário é criado com sucesso', async () => {
    const { sut } = makeSut();

    const createdUser = await sut.execute(user);

    expect(createdUser).toBeTruthy();
    expect(createdUser.id).toBe(user.id);
    expect(createdUser.name).toBe(user.name);
    expect(createdUser.email).toBe(user.email);
    expect(createdUser.tokens).toBeDefined();
    expect(createdUser.tokens.accessToken).toBeDefined();
    expect(createdUser.tokens.refreshToken).toBeDefined();
  });

  test('Deve lançar EmailAlreadyInUseError se o email já estiver em uso', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut();

    // Mock para simular que o email já existe
    import.meta.jest
      .spyOn(getUserByEmailRepositoryStub, 'execute')
      .mockResolvedValueOnce(user);

    const promise = sut.execute(user);

    await expect(promise).rejects.toThrow(
      new EmailAlreadyInUseError(user.email),
    );
  });
});
