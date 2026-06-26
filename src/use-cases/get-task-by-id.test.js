import { faker } from '@faker-js/faker';

import { GetTaskByIdUseCase } from './get-task-by-id';

describe('GetTaskByIdUseCase', () => {
  const task = {
    id: faker.string.uuid(),
    title: 'Tarefa teste',
    description: 'Descrição da tarefa teste',
    status: 'IN_PROGRESS',
  };

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
    expect(foundTask.title).toBe('Tarefa teste');
  });
});
