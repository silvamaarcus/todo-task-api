import { prisma } from '../../../../prisma/prisma.js';
import { user } from '../../../tests/fixtures/users.js';
import { CreateUserRepository } from './create-user.js';

describe('CreateUserRepository', () => {
  test('Deve salvar um novo usuário no banco de dados', async () => {
    const sut = new CreateUserRepository();

    const createUser = await sut.execute(user);

    expect(createUser.id).toBe(user.id);
    expect(createUser.name).toBe(user.name);
    expect(createUser.last_name).toBe(user.last_name);
    expect(createUser.email).toBe(user.email);
    expect(createUser.password).toBe(user.password);
  });

  test('Deve garantir que o Prisma lançe uma exceção caso não consiga salvar', async () => {
    const sut = new CreateUserRepository();
    import.meta.jest
      .spyOn(prisma.user, 'create')
      .mockImplementationOnce(new Error()); // Simula um erro no método create

    const promise = sut.execute(user);

    await expect(promise).rejects.toThrow(); // Lança uma exceção
  });
});
