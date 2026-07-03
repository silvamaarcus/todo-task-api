import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';

import { TaskNotFoundError } from '../../errors/index.js';
import { newTask, task } from '../../tests/fixtures/tasks.js';
import { UpdateTaskUseCase } from './update-task.js';

describe('UpdateTaskUseCase', () => {
  class GetTaskByIdRepositoryStub {
    async execute() {
      return task;
    }
  }

  class UpdateTaskRepositoryStub {
    async execute() {
      return newTask;
    }
  }

  const makeSut = () => {
    const getTaskByIdRepositoryStub = new GetTaskByIdRepositoryStub();
    const updateTaskRepositoryStub = new UpdateTaskRepositoryStub();
    const sut = new UpdateTaskUseCase(
      getTaskByIdRepositoryStub,
      updateTaskRepositoryStub,
    );

    return {
      sut,
      getTaskByIdRepositoryStub,
      updateTaskRepositoryStub,
    };
  };

  test('Deve atualizar a Task encontrada na db', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(task.id, task.user_id, newTask);

    expect(result.title).toBe('Novo Teste');
    expect(result.description).toBe('Comentário editato!');
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
