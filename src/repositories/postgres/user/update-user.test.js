import { faker } from '@faker-js/faker';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { prisma } from '../../../../prisma/prisma.js';
import { UserNotFoundError } from '../../../errors.js';
import { user } from '../../../tests/fixtures/users.js';
import { CreateUserRepository } from './create-user.js';
import { UpdateUserRepository } from './update-user.js';

describe('UpdateUserRepository', () => {
  const newParams = {
    ...user,
    name: faker.person.firstName(),
    last_name: faker.person.lastName(),
  };

  test('Deve atualizar um usuário com sucesso', async () => {
    const createUser = new CreateUserRepository();
    await createUser.execute(user);
    const sut = new UpdateUserRepository();
    const updateUserParams = newParams;

    const result = await sut.execute(user.id, updateUserParams);

    expect(result.name).toBe(updateUserParams.name);
    expect(result.last_name).toBe(updateUserParams.last_name);
  });

  test('Deve garantir que o Prisma recebeu parametros corretos', async () => {
    const createUser = new CreateUserRepository();
    await createUser.execute(user);
    const sut = new UpdateUserRepository();
    const prismaSpy = import.meta.jest.spyOn(prisma.user, 'update');
    const updateUserParams = newParams;

    await sut.execute(user.id, updateUserParams);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: { id: user.id },
      data: updateUserParams,
    });
  });

  test('Deve lançar o erro do Prisma', async () => {
    const sut = new UpdateUserRepository();
    import.meta.jest
      .spyOn(prisma.user, 'update')
      .mockRejectedValueOnce(new Error());

    const updateUserParams = newParams;

    const promise = sut.execute(user.id, updateUserParams);

    await expect(promise).rejects.toThrow();
  });

  test('Deve lançar o erro UserNotFoundError caso Prisma não encontre o usuário', () => {
    const sut = new UpdateUserRepository();
    import.meta.jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(
      new PrismaClientKnownRequestError('', {
        code: 'P2025',
      }),
    );

    const promise = sut.execute(user.id);
    expect(promise).rejects.toThrowError(new UserNotFoundError(user.id));
  });
});
