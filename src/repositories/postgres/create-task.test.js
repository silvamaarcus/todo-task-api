import { task } from '../../tests/fixtures/tasks';
import { CreateTaskRepository } from './create-task';

describe('CreateTaskRepository', () => {
  test('Deve salvar a Task no banco de dados', async () => {
    const sut = new CreateTaskRepository();

    const createTask = await sut.execute(task);

    expect(createTask.id).toBeDefined();
    expect(createTask.title).toBe('Teste');
    expect(createTask.description).toBe('Comentário...');
    expect(createTask.status).toBe('TODO');
  });
});
