import { faker } from '@faker-js/faker';

import { task } from '../../tests/fixtures/tasks.js';
import { CreateTaskRepository } from './create-task';
import { GetAllTasksRepository } from './get-all-tasks.js';

describe('GetAllTasksRepository', () => {
  test('Deve buscar todas as Tasks no banco', async () => {
    const task2 = {
      id: faker.string.uuid(),
      title: 'Teste 2',
      description: 'Comentário 2...',
      status: 'TODO',
    };

    // Cria duas Tasks no banco de dados
    const createRepository = new CreateTaskRepository();
    await createRepository.execute(task);
    await createRepository.execute(task2);

    // Buscar todas as Tasks
    const sut = new GetAllTasksRepository();
    const getAllTasks = await sut.execute();

    expect(getAllTasks).toHaveLength(2); // Verifica se o número de Tasks retornadas é 2
    expect(getAllTasks[0].title).toBe('Teste'); // Verifica se o título da primeira Task é "Teste"
    expect(getAllTasks[1].title).toBe('Teste 2'); // Verifica se o título da segunda Task é "Teste 2"
  });
});
