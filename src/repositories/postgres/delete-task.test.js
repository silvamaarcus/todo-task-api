import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { prisma } from '../../../prisma/prisma';
import { TaskNotFoundError } from '../../errors';
import { task } from '../../tests/fixtures/tasks';
import { DeleteTaskRepository } from './delete-task';

describe('DeleteTaskRepository', () => {
  test('Deve deletar uma Task no banco', async () => {
    const sut = new DeleteTaskRepository();
    await prisma.task.create({ data: task });

    const deleteTask = await sut.execute(task.id);

    expect(deleteTask.id).toBeDefined();
    expect(deleteTask.title).toBe('Teste');
  });

  test('Deve garantir que o Prisma recebeu o ID', async () => {
    const sut = new DeleteTaskRepository();
    await prisma.task.create({ data: task });
    const prismaSpy = import.meta.jest.spyOn(prisma.task, 'delete');
    const taskId = task.id;

    await sut.execute(taskId);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: { id: taskId },
    });
  });

  test('Deve lançar o erro do Prisma', async () => {
    const sut = new DeleteTaskRepository();
    import.meta.jest
      .spyOn(prisma.task, 'update')
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
