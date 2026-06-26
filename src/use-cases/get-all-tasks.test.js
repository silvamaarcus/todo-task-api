import { faker } from '@faker-js/faker';

import { GetAllTasksUseCase } from './get-all-tasks';

describe('GetAllTasksUseCase', () => {
  const tasks = [
    {
      id: faker.string.uuid(),
      title: 'Tarefa teste 1',
      description: 'Descrição da tarefa teste 1',
      status: 'IN_PROGRESS',
    },
    {
      id: faker.string.uuid(),
      title: 'Tarefa teste 2',
      description: 'Descrição da tarefa teste 2',
      status: 'COMPLETED',
    },
  ];

  class GetAllTasksRepositoryStub {
    async execute() {
      return tasks;
    }
  }

  const makeSut = () => {
    const getAllTasksRepositoryStub = new GetAllTasksRepositoryStub();
    const sut = new GetAllTasksUseCase(getAllTasksRepositoryStub);

    return {
      getAllTasksRepositoryStub,
      sut,
    };
  };

  test('Deve retornar todas as Tasks', async () => {
    const { sut } = makeSut();

    const tasksFounded = await sut.execute();

    expect(tasksFounded).toEqual(tasks); // Verifica se o resultado é igual ao array de tarefas esperado
  });
});
