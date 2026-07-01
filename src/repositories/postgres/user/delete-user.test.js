import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { prisma } from '../../../../prisma/prisma.js';
import { UserNotFoundError } from '../../../errors/index.js';
import { user } from '../../../tests/fixtures/users.js';
import { CreateUserRepository } from './create-user.js';
import { DeleteUserRepository } from './delete-user.js';

describe('DeleteUserRepository', () => {
  test('Deve deletar uma Task no banco', async () => {
    const createUser = new CreateUserRepository();
    await createUser.execute(user);
    const sut = new DeleteUserRepository();

    const deleteUser = await sut.execute(user.id);

    expect(deleteUser.email).toBe(deleteUser.email);
  });

  test('Deve garantir que o Prisma recebeu o ID', async () => {
    const createUser = new CreateUserRepository();
    await createUser.execute(user);
    const sut = new DeleteUserRepository();
    const prismaSpy = import.meta.jest.spyOn(prisma.user, 'delete');
    const userId = user.id;

    await sut.execute(userId);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: { id: userId },
    });
  });

  test('Deve lançar o erro do Prisma', async () => {
    const sut = new DeleteUserRepository();
    import.meta.jest
      .spyOn(prisma.user, 'delete')
      .mockRejectedValueOnce(new Error());

    const userId = user.id;

    const promise = sut.execute(userId);

    await expect(promise).rejects.toThrow();
  });

  test('Deve lançar o erro UserNotFoundError caso Prisma não encontre o usuário', () => {
    const sut = new DeleteUserRepository();
    import.meta.jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
      new PrismaClientKnownRequestError('', {
        code: 'P2025',
      }),
    );

    const promise = sut.execute(user.id);
    expect(promise).rejects.toThrowError(new UserNotFoundError(user.id));
  });
});
