import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';

import { TaskNotFoundError } from '../errors.js';
import { UpdateTaskUseCase } from './update-task.js';

describe('UpdateTaskUseCase', () => {
  const task = {
    id: faker.string.uuid(),
    title: 'Teste',
    description: 'Comentário...',
    status: 'TODO',
  };

  const newTask = {
    id: faker.string.uuid(),
    title: 'Novo Teste',
    description: 'Comentário editato!',
    status: 'IN_PROGRESS',
  };

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

  test('Deve atualizar a Task encontrada', async () => {
    const { sut } = makeSut();

    const taskFound = await sut.execute(task.id, newTask);

    expect(taskFound.id).toBeDefined();
    expect(taskFound.title).toBe('Novo Teste');
    expect(taskFound.description).toBe('Comentário editato!');
    expect(taskFound.status).toBe('IN_PROGRESS');
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
