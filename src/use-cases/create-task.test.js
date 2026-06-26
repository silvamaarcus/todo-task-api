import { faker } from '@faker-js/faker';

import { TASK_TYPE } from '../constants/index.js';
import { CreateTaskUseCase } from './create-task';

describe('CreateTaskUseCase', () => {
  // Stub para gerar ID
  class IdGeneratorAdapterStub {
    execute() {
      return faker.string.uuid(); // Simula ID gerado
    }
  }

  // Stub para criar uma Task
  class CreateTaskRepositoryStub {
    async execute(task) {
      return task;
    }
  }

  const task = {
    title: 'Nova atividade',
    description: 'Teste de descrição',
    type: TASK_TYPE.TODO,
  };

  const makeSut = () => {
    const idGeneratorAdapterStub = new IdGeneratorAdapterStub();
    const createTaskRepositoryStub = new CreateTaskRepositoryStub();

    const sut = new CreateTaskUseCase(
      idGeneratorAdapterStub,
      createTaskRepositoryStub,
    );

    return {
      sut,
      idGeneratorAdapterStub,
      createTaskRepositoryStub,
    };
  };

  test('Testa se uma nova Task é criada com sucesso', async () => {
    const { sut } = makeSut();

    const createTask = await sut.execute(task);

    expect(createTask).toBeTruthy();
    expect(createTask.id).toBeDefined();
    expect(createTask.title).toBe(task.title);
    expect(createTask.description).toBe(task.description);
    expect(createTask.status).toBe(TASK_TYPE.TODO);
  });
});
