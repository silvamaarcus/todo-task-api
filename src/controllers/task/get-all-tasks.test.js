import { task } from '../../tests/fixtures/tasks';
import { GetAllTasksController } from './get-all-tasks';

describe('GetAllTasksController', () => {
  class GetAllTasksTaskUseCaseStub {
    async execute() {
      return task;
    }
  }

  const makeSut = () => {
    const getAllTasksTaskUseCaseStub = new GetAllTasksTaskUseCaseStub();
    const sut = new GetAllTasksController(getAllTasksTaskUseCaseStub);

    return {
      getAllTasksTaskUseCaseStub,
      sut,
    };
  };

  const httpRequest = {
    query: undefined,
    body: task,
  };

  test('Deve retornar 200 quando status é undefined', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });

  test('Deve retornar 200 quando status válido', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      query: { status: 'TODO' },
    });

    expect(result.statusCode).toBe(200);
  });

  test('Deve retornar 400 quando status inválido', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      query: { status: 'INVALIDO' },
    });

    expect(result.statusCode).toBe(400);
  });

  test('Deve retornar 500 quando ocorrer erro interno no servidor', async () => {
    const { sut, getAllTasksTaskUseCaseStub } = makeSut();
    import.meta.jest
      .spyOn(getAllTasksTaskUseCaseStub, 'execute')
      .mockRejectedValueOnce(new Error());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
