import { faker } from '@faker-js/faker';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { prisma } from '../../../../prisma/prisma.js';
import { TaskNotFoundError } from '../../../errors/index.js';
import { task } from '../../../tests/fixtures/tasks.js';
import { user } from '../../../tests/fixtures/users.js';
import { CreateUserRepository } from '../user/create-user.js';
import { CreateTaskRepository } from './create-task.js';
import { DeleteTaskRepository } from './delete-task.js';

describe('DeleteTaskRepository', () => {
  test('Deve deletar uma Task no banco', async () => {
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
    const sut = new DeleteTaskRepository();

    const deleteTask = await sut.execute(task.id, userId);

    expect(deleteTask.id).toBeDefined();
    expect(deleteTask.title).toBe('Teste');
  });

  test('Deve garantir que o Prisma recebeu parametros corretos', async () => {
    const sut = new DeleteTaskRepository();
    import.meta.jest
      .spyOn(prisma.task, 'delete')
      .mockResolvedValueOnce(task.id, task.user_id); // Simula a exclusão da Task

    await sut.execute(task.id, task.user_id);

    expect(prisma.task.delete).toHaveBeenCalledWith({
      where: {
        user_id: task.user_id,
        id: task.id,
      },
    });
  });

  test('Deve lançar o erro do Prisma', async () => {
    const sut = new DeleteTaskRepository();
    import.meta.jest
      .spyOn(prisma.task, 'delete')
      .mockRejectedValueOnce(new Error());

    const taskId = task.id;

    const promise = sut.execute(taskId);

    await expect(promise).rejects.toThrow();
  });

  test('Deve lançar o erro TaskNotFoundError caso Prisma não encontre a Task', () => {
    const sut = new DeleteTaskRepository();
    import.meta.jest.spyOn(prisma.task, 'delete').mockRejectedValueOnce(
      new PrismaClientKnownRequestError('', {
        code: 'P2025',
      }),
    );

    const promise = sut.execute(task.id);
    expect(promise).rejects.toThrowError(new TaskNotFoundError(task.id));
  });
});
