import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';

import { TaskNotFoundError } from '../errors.js';
import { DeleteTaskUseCase } from './delete-task.js';

describe('DeleteTaskUseCase', () => {
  const task = {
    id: faker.string.uuid(),
    title: 'Teste',
    description: 'Comentário...',
    status: 'TODO',
  };

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

  test('Deve deletar a Task encontrada', async () => {
    const { sut } = makeSut();

    const taskFound = await sut.execute(task.id);

    expect(taskFound.id).toBeDefined();
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
