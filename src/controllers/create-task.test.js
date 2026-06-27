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
      title: httpRequest.body.title,
      description: httpRequest.body.description,
    }); // Zod valida apenas title e description
  });
});
