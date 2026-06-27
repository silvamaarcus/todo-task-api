import { task } from '../tests/fixtures/tasks';
import { GetTaskByIdController } from './get-task-by-id';

describe('GetTaskByIdController', () => {
  class GetTaskByIdUseCaseStub {
    async execute() {
      return task;
    }
  }

  const makeSut = () => {
    const getTaskByIdUseCaseStub = new GetTaskByIdUseCaseStub();
    const sut = new GetTaskByIdController(getTaskByIdUseCaseStub);

    return {
      getTaskByIdUseCaseStub,
      sut,
    };
  };

  const httpRequest = {
    params: {
      id: task.id,
    },
  };

  test('Deve retornar 201 quando uma Task for encontrada com sucesso', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(task);
  });
});
