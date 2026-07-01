import { faker } from '@faker-js/faker';

import { prisma } from '../../../../prisma/prisma.js';
import { user } from '../../../tests/fixtures/users.js';
import { CreateUserRepository } from './create-user.js';
import { GetUserByIdRepository } from './get-user-by-id.js';

describe('GetUserByIdRepository', () => {
  test('Deve buscar um usuário pelo ID', async () => {
    const createUser = new CreateUserRepository();
    await createUser.execute(user);
    const sut = new GetUserByIdRepository();

    const userFounded = await sut.execute(user.id);

    expect(userFounded.id).toBe(user.id);
  });

  test('Deve garantir que o Prisma lançe uma exceção caso não consiga encontrar', async () => {
    const sut = new GetUserByIdRepository();
    import.meta.jest
      .spyOn(prisma.user, 'findUnique')
      .mockRejectedValueOnce(new Error('Erro de teste'));

    const promise = sut.execute(faker.string.uuid());

    await expect(promise).rejects.toThrow(); // Lança uma exceção
  });
});
