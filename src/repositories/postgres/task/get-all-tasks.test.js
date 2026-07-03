import { faker } from '@faker-js/faker';

import {
  task_done,
  task_in_progress,
  task_todo,
} from '../../../tests/fixtures/tasks.js';
import { user } from '../../../tests/fixtures/users.js';
import { CreateUserRepository } from '../user/create-user.js';
import { CreateTaskRepository } from './create-task.js';
import { GetAllTasksRepository } from './get-all-tasks.js';

describe('GetAllTasksRepository', () => {
  test('Deve buscar todas as Tasks no banco', async () => {
    // Cria um usuário com o mesmo ID que a task espera
    const createUserRepository = new CreateUserRepository();
    const userId = faker.string.uuid();
    await createUserRepository.execute({
      ...user,
      id: userId, // Garante que o user_id seja o mesmo da task
    });

    // Cria Tasks no banco de dados
    const createRepository = new CreateTaskRepository();
    await createRepository.execute({ ...task_todo, user_id: userId });
    await createRepository.execute({ ...task_in_progress, user_id: userId });
    await createRepository.execute({ ...task_done, user_id: userId });
    const filters = { user_id: userId }; // Filtro para buscar todas as Tasks do usuário

    // Buscar todas as Tasks
    const sut = new GetAllTasksRepository();
    const getAllTasks = await sut.execute(filters);

    expect(getAllTasks).toHaveLength(3); // Verifica se o número de Tasks retornadas é 3
    expect(getAllTasks[0].title).toBe('Tarefa teste 1');
    expect(getAllTasks[1].title).toBe('Tarefa teste 2');
    expect(getAllTasks[2].title).toBe('Tarefa teste 3');
  });
});
