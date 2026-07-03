import { faker } from '@faker-js/faker';

import { TaskNotFoundError } from '../../errors';
import { task } from '../../tests/fixtures/tasks';
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

  test('Deve retornar 200 quando uma Task for atualizada com sucesso', async () => {
    const { sut, updateTaskUseCaseStub } = makeSut();
    const userId = faker.string.uuid();
    const updatedTask = {
      ...task,
      title: 'Jantar',
      description: 'Comer apenas carne e salada',
      user_id: userId,
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
        user_id: userId,
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body.title).toBe('Jantar');
    expect(result.body.description).toBe('Comer apenas carne e salada');
  });

  test('Deve retornar 400 quando uma Task receber status não permitido (TODO, IN_PROGRESS, DONE)', async () => {
    const { sut, updateTaskUseCaseStub } = makeSut();
    const updatedTask = {
      ...task,
      title: 'Jantar',
      description: 'Comer apenas carne e salada',
      status: 'INVALID_STATUS', // Força status que não existe
    };
    import.meta.jest
      .spyOn(updateTaskUseCaseStub, 'execute')
      .mockResolvedValueOnce(updatedTask);

    const result = await sut.execute({
      params: {
        id: task.id,
      },
      body: updatedTask,
    });

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe(
      'Status inválido! Escolha: TODO, IN_PROGRESS ou DONE',
    );
  });

  test('Deve retornar 400 quando uma Task não for atualizada por falta de parametros', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      params: {
        id: task.id,
      },
      body: {
        title: '',
      },
    });

    expect(result.statusCode).toBe(400);
  });

  test('Deve retornar 404 quando a Task não for encontrada', async () => {
    const { sut, updateTaskUseCaseStub } = makeSut();

    import.meta.jest
      .spyOn(updateTaskUseCaseStub, 'execute')
      .mockRejectedValueOnce(new TaskNotFoundError()); // Forçar erro no metódo execute

    const result = await sut.execute({
      params: {
        id: '',
      },
      body: {
        title: 'Jantar',
        user_id: faker.string.uuid(),
      },
    });

    expect(result.statusCode).toBe(404);
  });

  test('Deve retornar 400 quando ID inválido', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      params: {
        id: 'invalid-id',
      },
      body: {
        title: 'Jantar',
        user_id: '',
      },
    });

    expect(result.statusCode).toBe(400);
  });

  test('Deve retornar 500 quando ocorrer erro interno no servidor', async () => {
    const { sut, updateTaskUseCaseStub } = makeSut();
    import.meta.jest
      .spyOn(updateTaskUseCaseStub, 'execute')
      .mockRejectedValueOnce(new Error());

    const result = await sut.execute({
      params: {
        id: task.id,
      },
      body: {
        title: 'Jantar',
        description: 'Comer apenas carne e salada',
        user_id: faker.string.uuid(),
      },
    });

    expect(result.statusCode).toBe(500);
  });
});
