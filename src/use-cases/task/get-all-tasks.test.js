import {
  task_done,
  task_in_progress,
  task_todo,
} from '../../tests/fixtures/tasks.js';
import { GetAllTasksUseCase } from './get-all-tasks.js';

describe('GetAllTasksUseCase', () => {
  class GetAllTasksRepositoryStub {
    async execute() {
      return tasks;
    }
  }

  const tasks = [task_todo, task_in_progress, task_done];

  const makeSut = () => {
    const getAllTasksRepositoryStub = new GetAllTasksRepositoryStub();
    const sut = new GetAllTasksUseCase(getAllTasksRepositoryStub);

    return {
      getAllTasksRepositoryStub,
      sut,
    };
  };

  test('Deve retornar todas as Tasks', async () => {
    const { sut } = makeSut();

    const tasksFounded = await sut.execute();

    expect(tasksFounded).toEqual(tasks); // Verifica se o resultado é igual ao array de tarefas esperado
  });

  test('Deve retornar todas as Tasks com filtro TODO', async () => {
    const { sut, getAllTasksRepositoryStub } = makeSut();

    const spy = import.meta.jest.spyOn(getAllTasksRepositoryStub, 'execute');

    await sut.execute({ status: 'TODO' });

    expect(spy).toHaveBeenCalledWith({ status: 'TODO' });
  });

  test('Deve retornar todas as Tasks com filtro IN_PROGRESS', async () => {
    const { sut, getAllTasksRepositoryStub } = makeSut();

    const spy = import.meta.jest.spyOn(getAllTasksRepositoryStub, 'execute');

    await sut.execute({ status: 'IN_PROGRESS' });

    expect(spy).toHaveBeenCalledWith({ status: 'IN_PROGRESS' });
  });

  test('Deve retornar todas as Tasks com filtro DONE', async () => {
    const { sut, getAllTasksRepositoryStub } = makeSut();

    const spy = import.meta.jest.spyOn(getAllTasksRepositoryStub, 'execute');

    await sut.execute({ status: 'DONE' });

    expect(spy).toHaveBeenCalledWith({ status: 'DONE' });
  });
});
