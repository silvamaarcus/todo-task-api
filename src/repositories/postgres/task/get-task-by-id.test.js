import { faker } from '@faker-js/faker';

import { prisma } from '../../../../prisma/prisma';
import { task } from '../../../tests/fixtures/tasks';
import { CreateTaskRepository } from './create-task';
import { GetTaskByIdRepository } from './get-task-by-id';

describe('GetTaskByIdRepository', () => {
  test('Deve buscar uma Task pelo ID', async () => {
    const createTask = new CreateTaskRepository();
    await createTask.execute(task);

    const sut = new GetTaskByIdRepository();
    const result = await sut.execute(task.id);

    expect(result.id).toBeDefined();
    expect(result.title).toBe('Teste');
  });

  test('Deve garantir que o Prisma lançe uma exceção caso não consiga encontrar', async () => {
    const sut = new GetTaskByIdRepository();
    import.meta.jest
      .spyOn(prisma.task, 'findUnique')
      .mockRejectedValueOnce(new Error('Erro de teste'));

    const promise = sut.execute(faker.string.uuid());

    await expect(promise).rejects.toThrow(); // Lança uma exceção
  });
});
