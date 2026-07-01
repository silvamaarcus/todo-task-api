import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';

import { TaskNotFoundError } from '../../errors/index.js';
import { task } from '../../tests/fixtures/tasks.js';
import { GetTaskByIdUseCase } from './get-task-by-id.js';

describe('GetTaskByIdUseCase', () => {
  // Stub que simula o banco retornando uma tarefa
  class GetTaskByIdRepositoryStub {
    async execute() {
      return task;
    }
  }

  const makeSut = () => {
    const getTaskByIdRepositoryStub = new GetTaskByIdRepositoryStub();
    const sut = new GetTaskByIdUseCase(getTaskByIdRepositoryStub);

    return { sut, getTaskByIdRepositoryStub };
  };

  test('Retorna a tarefa quando ela existe', async () => {
    const { sut } = makeSut();

    const taskId = faker.string.uuid();
    const foundTask = await sut.execute(taskId);

    expect(foundTask).toBeTruthy();
    expect(foundTask.id).toBeDefined();
    expect(foundTask.title).toBe('Teste');
  });

  test('Lança TaskNotFoundError quando a tarefa não existe', async () => {
    const { sut, getTaskByIdRepositoryStub } = makeSut();

    // Sobrescrevemos o comportamento do stub p/ retornar null, simulando "não encontrado no banco"
    jest
      .spyOn(getTaskByIdRepositoryStub, 'execute')
      .mockResolvedValueOnce(null);

    const taskId = faker.string.uuid();

    // Verificamos que o use case lança o erro correto
    await expect(sut.execute(taskId)).rejects.toThrow(TaskNotFoundError);
  });
});
