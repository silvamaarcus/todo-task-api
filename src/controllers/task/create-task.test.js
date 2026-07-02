import { task } from '../../tests/fixtures/tasks.js';
import { CreateTaskController } from './create-task.js';

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

  test('Deve retornar 400 quando uma Task não receber um Título obrigatório', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        ...task,
        title: undefined,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  test('Deve retornar 400 quando uma Task receber um Título vazio', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        ...task,
        title: '',
      },
    });

    expect(result.statusCode).toBe(400);
  });

  test('Deve verificar se CreateTaskUseCase é chamado com os parâmetros corretos', async () => {
    const { sut, createTaskUseCaseStub } = makeSut();
    const executeSpy = import.meta.jest.spyOn(createTaskUseCaseStub, 'execute');

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledTimes(1); // Verifica se o método foi chamado apenas uma vez
    expect(executeSpy).toHaveBeenCalledWith({
      user_id: httpRequest.body.user_id,
      title: httpRequest.body.title,
      description: httpRequest.body.description,
      status: httpRequest.body.status,
    }); // Zod valida user_id, title, description e status
  });

  test('Deve retornar 500 quando ocorrer erro interno no servidor', async () => {
    const { sut, createTaskUseCaseStub } = makeSut();
    import.meta.jest
      .spyOn(createTaskUseCaseStub, 'execute')
      .mockRejectedValueOnce(new Error());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
