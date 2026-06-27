import { task } from '../tests/fixtures/tasks';
import { CreateTaskController } from './create-task';

describe('CreateTaskController', () => {
  class CreateTaskUseCaseStub {
    async execute() {
      return task;
    }
  }

  const makeSut = () => {
    const createTaskUseCaseStub = new CreateTaskUseCaseStub();
    const sut = new CreateTaskController(createTaskUseCaseStub);

    return {
      createTaskUseCaseStub,
      sut,
    };
  };

  const httpRequest = {
    body: task,
  };

  test('Deve retornar 201 quando uma Task for criada com sucesso', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(httpRequest.body);
  });
});
