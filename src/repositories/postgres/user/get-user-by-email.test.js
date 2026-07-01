import { faker } from '@faker-js/faker';

import { prisma } from '../../../../prisma/prisma';
import { user } from '../../../tests/fixtures/users.js';
import { CreateUserRepository } from './create-user.js';
import { GetUserByEmailRepository } from './get-user-by-email.js';

describe('GetUserByEmailRepository', () => {
  test('Deve buscar um usuário pelo email', async () => {
    const createUser = new CreateUserRepository();
    await createUser.execute({ ...user, email: 'teste@teste.com' });
    const sut = new GetUserByEmailRepository();

    const userFounded = await sut.execute('teste@teste.com');

    expect(userFounded.email).toBe('teste@teste.com');
  });

  test('Deve garantir que o Prisma lançe uma exceção caso não consiga encontrar', async () => {
    const sut = new GetUserByEmailRepository();
    import.meta.jest
      .spyOn(prisma.user, 'findUnique')
      .mockRejectedValueOnce(new Error('Erro de teste'));

    const promise = sut.execute(faker.internet.email());

    await expect(promise).rejects.toThrow(); // Lança uma exceção
  });
});
