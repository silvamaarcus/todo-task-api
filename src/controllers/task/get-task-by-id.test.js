import { TaskNotFoundError } from '../../errors';
import { task } from '../../tests/fixtures/tasks';
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

  test('Deve retornar 200 quando uma Task for encontrada com sucesso', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(task);
  });

  test('Deve retornar 404 quando a Task não for encontrada', async () => {
    const { sut, getTaskByIdUseCaseStub } = makeSut();
    const taskId = ''; // Forçar ID da Task errado

    import.meta.jest
      .spyOn(getTaskByIdUseCaseStub, 'execute')
      .mockRejectedValueOnce(new TaskNotFoundError()); // Forçar erro no metódo execute

    const result = await sut.execute({
      params: {
        id: taskId,
      },
    });

    expect(result.statusCode).toBe(404);
  });

  test('Deve retornar 500 quando ocorrer erro interno no servidor', async () => {
    const { sut, getTaskByIdUseCaseStub } = makeSut();
    import.meta.jest
      .spyOn(getTaskByIdUseCaseStub, 'execute')
      .mockRejectedValueOnce(new Error());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
