import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';

import { TaskNotFoundError } from '../../errors/index.js';
import { task } from '../../tests/fixtures/tasks.js';
import { DeleteTaskUseCase } from './delete-task.js';

describe('DeleteTaskUseCase', () => {
  class GetTaskByIdRepositoryStub {
    async execute() {
      return task;
    }
  }

  class DeleteTaskRepositoryStub {
    async execute() {
      return task;
    }
  }

  const makeSut = () => {
    const getTaskByIdRepositoryStub = new GetTaskByIdRepositoryStub();
    const deleteTaskRepositoryStub = new DeleteTaskRepositoryStub();
    const sut = new DeleteTaskUseCase(
      getTaskByIdRepositoryStub,
      deleteTaskRepositoryStub,
    );

    return {
      sut,
      getTaskByIdRepositoryStub,
      deleteTaskRepositoryStub,
    };
  };

  test('Deve deletar a Task encontrada na db', async () => {
    const { sut } = makeSut();

    const taskFound = await sut.execute(task.id, task.user_id);

    expect(taskFound.id).toBeDefined();
  });

  test('Deve lançar TaskNotFoundError quando a Task não pertencer ao usuário', async () => {
    const { sut, getTaskByIdRepositoryStub } = makeSut();

    jest
      .spyOn(getTaskByIdRepositoryStub, 'execute')
      .mockResolvedValueOnce(task);

    const taskId = faker.string.uuid();
    const userId = faker.string.uuid(); // ID de usuário diferente do task.user_id

    await expect(sut.execute(taskId, userId)).rejects.toThrow(
      TaskNotFoundError,
    );
  });

  test('Deve lançar TaskNotFoundError quando a Task não for encontrada', async () => {
    const { sut, getTaskByIdRepositoryStub } = makeSut();

    jest
      .spyOn(getTaskByIdRepositoryStub, 'execute')
      .mockResolvedValueOnce(null);

    const taskId = faker.string.uuid();

    await expect(sut.execute(taskId)).rejects.toThrow(TaskNotFoundError);
  });
});
