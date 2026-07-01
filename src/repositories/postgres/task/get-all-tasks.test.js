import { tasks } from '../../../tests/fixtures/tasks.js';
import { CreateTaskRepository } from './create-task';
import { GetAllTasksRepository } from './get-all-tasks.js';

describe('GetAllTasksRepository', () => {
  test('Deve buscar todas as Tasks no banco', async () => {
    // Cria duas Tasks no banco de dados
    const createRepository = new CreateTaskRepository();
    await createRepository.execute(tasks[0]);
    await createRepository.execute(tasks[1]);
    await createRepository.execute(tasks[2]);

    // Buscar todas as Tasks
    const sut = new GetAllTasksRepository();
    const getAllTasks = await sut.execute();

    console.log(getAllTasks);

    expect(getAllTasks).toHaveLength(3); // Verifica se o número de Tasks retornadas é 2
    expect(getAllTasks[0].title).toBe('Tarefa teste 1');
    expect(getAllTasks[1].title).toBe('Tarefa teste 2');
    expect(getAllTasks[2].title).toBe('Tarefa teste 3');
  });
});
