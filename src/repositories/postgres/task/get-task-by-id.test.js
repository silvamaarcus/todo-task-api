import { faker } from '@faker-js/faker';

import { prisma } from '../../../../prisma/prisma.js';
import { task } from '../../../tests/fixtures/tasks.js';
import { user } from '../../../tests/fixtures/users.js';
import { CreateUserRepository } from '../user/create-user.js';
import { CreateTaskRepository } from './create-task.js';
import { GetTaskByIdRepository } from './get-task-by-id.js';

describe('GetTaskByIdRepository', () => {
  test('Deve buscar uma Task pelo ID na db', async () => {
    // Cria um usuário com o mesmo ID que a task espera
    const createUserRepository = new CreateUserRepository();
    const userId = faker.string.uuid();
    await createUserRepository.execute({
      ...user,
      id: userId, // Garante que o user_id seja o mesmo da task
    });

    // Cria uma Task no banco de dados
    const createTask = new CreateTaskRepository();
    await createTask.execute({ ...task, user_id: userId });

    const sut = new GetTaskByIdRepository();
    const result = await sut.execute(task.id);

    expect(result.user_id).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.title).toBe('Teste');
  });

  test('Deve garantir que o Prisma lançe uma exceção caso não consiga encontrar', async () => {
    const sut = new GetTaskByIdRepository();
    import.meta.jest
      .spyOn(prisma.task, 'findUnique')
      .mockRejectedValueOnce(new Error('Erro de teste'));

    const promise = sut.execute('');

    await expect(promise).rejects.toThrow(); // Lança uma exceção
  });
});
