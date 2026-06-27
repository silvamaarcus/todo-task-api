import { tasks } from '../tests/fixtures/tasks.js';
import { GetAllTasksUseCase } from './get-all-tasks.js';

describe('GetAllTasksUseCase', () => {
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
