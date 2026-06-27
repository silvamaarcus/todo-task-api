import { task } from '../tests/fixtures/tasks';
import { UpdateTaskController } from './update-task';

describe('UpdateTaskController', () => {
  class UpdateTaskUseCaseStub {
    async execute() {
      return task;
    }
  }

  const makeSut = () => {
    const updateTaskUseCaseStub = new UpdateTaskUseCaseStub();
    const sut = new UpdateTaskController(updateTaskUseCaseStub);

    return {
      updateTaskUseCaseStub,
      sut,
    };
  };

  test('Deve retornar 201 quando uma Task for atualizada com sucesso', async () => {
    const { sut, updateTaskUseCaseStub } = makeSut();
    const updatedTask = {
      ...task,
      title: 'Jantar',
      description: 'Comer apenas carne e salada',
    };
    import.meta.jest
      .spyOn(updateTaskUseCaseStub, 'execute')
      .mockResolvedValueOnce(updatedTask);

    const result = await sut.execute({
      params: {
        id: task.id,
      },
      body: {
        title: 'Jantar',
        description: 'Comer apenas carne e salada',
      },
    });

    expect(result.statusCode).toBe(201);
    expect(result.body.title).toBe('Jantar');
    expect(result.body.description).toBe('Comer apenas carne e salada');
  });
});
