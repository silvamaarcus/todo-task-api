import { task } from '../../tests/fixtures/tasks';
import { CreateTaskRepository } from './create-task';
import { GetTaskByIdRepository } from './get-task-by-id';

describe('GetTaskByIdRepository', () => {
  test('Deve buscar uma Task pelo ID', async () => {
    const createTask = new CreateTaskRepository();
    await createTask.execute(task);

    const sut = new GetTaskByIdRepository();
    const result = await sut.execute(task.id);

    expect(result.id).toBeDefined();
    expect(result.title).toBe('Teste');
  });
});
