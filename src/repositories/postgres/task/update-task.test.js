import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { prisma } from '../../../../prisma/prisma.js';
import { TaskNotFoundError } from '../../../errors';
import { newTask, task } from '../../../tests/fixtures/tasks';
import { UpdateTaskRepository } from './update-task';

describe('UpdateTaskRepository', () => {
  test('Deve atualizar uma Task', async () => {
    const sut = new UpdateTaskRepository();
    await prisma.task.create({ data: task }); // Cria a Task
    const updateTaskParams = newTask;

    const result = await sut.execute(task.id, updateTaskParams);

    expect(result.title).toBe('Novo Teste');
    expect(result.description).toBe('Comentário editato!');
  });

  test('Deve garantir que o Prisma recebeu parametros corretos', async () => {
    const sut = new UpdateTaskRepository();
    await prisma.task.create({ data: task });
    const prismaSpy = import.meta.jest.spyOn(prisma.task, 'update');
    const updateTaskParams = newTask;

    await sut.execute(task.id, updateTaskParams);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: { id: task.id },
      data: updateTaskParams,
    });
  });

  test('Deve lançar o erro do Prisma', async () => {
    const sut = new UpdateTaskRepository();
    import.meta.jest
      .spyOn(prisma.task, 'update')
      .mockRejectedValueOnce(new Error());

    const updateTaskParams = newTask;

    const promise = sut.execute(task.id, updateTaskParams);

    await expect(promise).rejects.toThrow();
  });

  test('Deve lançar o erro TaskNotFoundError caso Prisma não encontre a Task', () => {
    const sut = new UpdateTaskRepository();
    import.meta.jest.spyOn(prisma.task, 'update').mockRejectedValueOnce(
      new PrismaClientKnownRequestError('', {
        code: 'P2025',
      }),
    );

    const promise = sut.execute(task.id);
    expect(promise).rejects.toThrowError(new TaskNotFoundError(task.id));
  });
});
