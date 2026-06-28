import { TaskNotFoundError } from '../errors';
import { task } from '../tests/fixtures/tasks';
import { DeleteTaskController } from './delete-task';

describe('DeleteTaskController', () => {
  class DeleteTaskUseCaseStub {
    async execute() {
      return task;
    }
  }

  const makeSut = () => {
    const deleteTaskUseCaseStub = new DeleteTaskUseCaseStub();
    const sut = new DeleteTaskController(deleteTaskUseCaseStub);

    return {
      deleteTaskUseCaseStub,
      sut,
    };
  };

  const httpRequest = {
    params: {
      id: task.id,
    },
  };

  test('Deve retornar 201 quando uma Task for deletada com sucesso', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(201);
  });

  test('Deve retornar 404 quando a Task não for encontrada', async () => {
    const { sut, deleteTaskUseCaseStub } = makeSut();

    import.meta.jest
      .spyOn(deleteTaskUseCaseStub, 'execute')
      .mockRejectedValueOnce(new TaskNotFoundError()); // Forçar erro no metódo execute

    const result = await sut.execute({
      params: {
        id: '',
      },
    });

    expect(result.statusCode).toBe(404);
  });

  test('Deve retornar 500 quando ocorrer erro interno no servidor', async () => {
    const { sut, deleteTaskUseCaseStub } = makeSut();
    import.meta.jest
      .spyOn(deleteTaskUseCaseStub, 'execute')
      .mockRejectedValueOnce(new Error());

    const result = await sut.execute({
      params: {
        id: task.id,
      },
    });

    expect(result.statusCode).toBe(500);
  });
});
