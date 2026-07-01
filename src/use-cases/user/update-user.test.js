import { UserNotFoundError } from '../../errors/index.js';
import { user } from '../../tests/fixtures/users.js';
import { UpdateUserUseCase } from './update-user.js';

describe('UpdateUserUseCase', () => {
  class GetUserByEmailRepositoryStub {
    async execute() {
      return null; // Email não está em uso
    }
  }

  class PasswordHasherAdapterStub {
    async execute() {
      return '$2a$10$Dgrl1AFfuRdl3fS7kA80huD8y3QeQhabdxupy7xpY0Yw.v8a7VcUS';
    }
  }

  class UpdateUserRepositoryStub {
    async execute(userId, updateUserParams) {
      return {
        ...user,
        ...updateUserParams,
      };
    }
  }

  const makeSut = () => {
    const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub();
    const passwordHasherAdapterStub = new PasswordHasherAdapterStub();
    const updateUserRepositoryStub = new UpdateUserRepositoryStub();

    const sut = new UpdateUserUseCase(
      getUserByEmailRepositoryStub,
      passwordHasherAdapterStub,
      updateUserRepositoryStub,
    );

    return {
      sut,
      getUserByEmailRepositoryStub,
      passwordHasherAdapterStub,
      updateUserRepositoryStub,
    };
  };

  test('Deve atualizar o nome e sobrenome de um usuário', async () => {
    const { sut } = makeSut();
    const updateUserParams = {
      name: 'Marcus',
      last_name: 'Silva',
    };

    const result = await sut.execute(user.id, updateUserParams);

    expect(result.name).toBe('Marcus');
    expect(result.last_name).toBe('Silva');
  });

  test('Deve atualizar a senha de um usuário', async () => {
    const { sut } = makeSut();
    const updateUserParams = {
      password: 'newpassword123',
    };

    const result = await sut.execute(user.id, updateUserParams);

    expect(result.password).toBeDefined();
    expect(result.password).not.toBe('newpassword123');
  });

  test('Deve atualizar o email de um usuário', async () => {
    const { sut } = makeSut();
    const updateUserParams = {
      email: 'novo@email.com',
    };

    const result = await sut.execute(user.id, updateUserParams);

    expect(result.email).toBe('novo@email.com');
  });

  test('Deve lançar uma exceção se o email fornecido já estiver em uso por outro usuário', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    import.meta.jest
      .spyOn(getUserByEmailRepositoryStub, 'execute')
      .mockResolvedValueOnce({ id: 'outro-usuario-id' }); // Simula que o email já está em uso por outro usuário
    const updateUserParams = {
      email: 'novo@email.com',
    };

    const promise = sut.execute(user.id, updateUserParams);

    await expect(promise).rejects.toThrow(
      new UserNotFoundError(updateUserParams.email),
    ); // Lança uma exceção
  });
});
