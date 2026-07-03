import { faker } from '@faker-js/faker';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { prisma } from '../../../../prisma/prisma.js';
import { TaskNotFoundError } from '../../../errors/index.js';
import { newTask, task } from '../../../tests/fixtures/tasks.js';
import { user } from '../../../tests/fixtures/users.js';
import { CreateUserRepository } from '../user/create-user.js';
import { CreateTaskRepository } from './create-task.js';
import { UpdateTaskRepository } from './update-task.js';

describe('UpdateTaskRepository', () => {
  test('Deve atualizar uma Task na db', async () => {
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
    // Envia os parâmetros de atualização para a Task c/ o mesmo user_id
    const updateTaskParams = { ...newTask, user_id: userId };
    const sut = new UpdateTaskRepository();

    const result = await sut.execute(task.id, userId, updateTaskParams);

    expect(result.title).toBe('Novo Teste');
    expect(result.description).toBe('Comentário editato!');
  });

  test('Deve garantir que o Prisma recebeu parametros corretos', async () => {
    const sut = new UpdateTaskRepository();
    import.meta.jest
      .spyOn(prisma.task, 'update')
      .mockResolvedValueOnce({ ...task, ...newTask }); // Simula a atualização da Task

    const updateTaskParams = newTask;

    await sut.execute(task.id, task.user_id, updateTaskParams);

    expect(prisma.task.update).toHaveBeenCalledWith({
      where: {
        user_id: task.user_id,
        id: task.id,
      },
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
