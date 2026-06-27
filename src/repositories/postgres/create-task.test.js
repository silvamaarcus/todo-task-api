import { prisma } from '../../../prisma/prisma.js';
import { task } from '../../tests/fixtures/tasks.js';
import { CreateTaskRepository } from './create-task.js';

describe('CreateTaskRepository', () => {
  test('Deve salvar a Task no banco de dados', async () => {
    const sut = new CreateTaskRepository();

    const createTask = await sut.execute(task);

    expect(createTask.id).toBeDefined();
    expect(createTask.title).toBe('Teste');
    expect(createTask.description).toBe('Comentário...');
    expect(createTask.status).toBe('TODO');
  });

  test('Deve garantir que o Prisma lançe uma exceção caso não consiga salvar', async () => {
    const sut = new CreateTaskRepository();
    import.meta.jest
      .spyOn(prisma.task, 'create')
      .mockImplementationOnce(new Error()); // Simula um erro no método create

    const promise = sut.execute(task);

    await expect(promise).rejects.toThrow(); // Lança uma exceção
  });
});
