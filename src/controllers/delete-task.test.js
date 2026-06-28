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
});
