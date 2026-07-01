import { user } from '../../tests/fixtures/users.js';
import { CreateUserController } from './create-user.js';

describe('CreateUserController', () => {
  class CreateUserUseCaseStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const createUserUseCaseStub = new CreateUserUseCaseStub();
    const sut = new CreateUserController(createUserUseCaseStub);

    return {
      createUserUseCaseStub,
      sut,
    };
  };

  const httpRequest = {
    body: user,
  };

  test('Deve retornar 201 quando um usuário for criado com sucesso', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(httpRequest.body);
  });

  test('Deve retornar 400 quando um usuário não receber um nome obrigatório', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        ...user,
        name: undefined,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  test('Deve retornar 400 quando um usuário não receber um sobrenome obrigatório', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        ...user,
        last_name: undefined,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  test('Deve retornar 400 quando um usuário não receber um email obrigatório', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        ...user,
        email: undefined,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  test('Deve retornar 400 quando um usuário não receber um password obrigatório', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        ...user,
        password: undefined,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  test('Deve retornar 400 quando um usuário receber um email vazio', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        ...user,
        email: '',
      },
    });

    expect(result.statusCode).toBe(400);
  });

  test('Deve retornar 400 quando um usuário receber um password incorreto', async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      body: {
        ...user,
        password: '1234', // Senha com menos de 6 caracteres
      },
    });

    expect(result.statusCode).toBe(400);
  });

  test('Deve verificar se CreateUserUseCase é chamado com os parâmetros corretos', async () => {
    const { sut, createUserUseCaseStub } = makeSut();
    const executeSpy = import.meta.jest.spyOn(createUserUseCaseStub, 'execute');

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(executeSpy).toHaveBeenCalledWith({
      name: httpRequest.body.name,
      last_name: httpRequest.body.last_name,
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  test('Deve retornar 500 quando ocorrer erro interno no servidor', async () => {
    const { sut, createUserUseCaseStub } = makeSut();
    import.meta.jest
      .spyOn(createUserUseCaseStub, 'execute')
      .mockRejectedValueOnce(new Error());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
