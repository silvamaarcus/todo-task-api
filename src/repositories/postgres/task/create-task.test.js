import { prisma } from '../../../../prisma/prisma.js';
import { task } from '../../../tests/fixtures/tasks.js';
import { user } from '../../../tests/fixtures/users.js';
import { CreateUserRepository } from '../user/create-user.js';
import { CreateTaskRepository } from './create-task.js';

describe('CreateTaskRepository', () => {
  test('Deve salvar a Task no banco de dados', async () => {
    // Cria um usuário com o mesmo ID que a task espera
    const createUserRepository = new CreateUserRepository();
    await createUserRepository.execute({
      ...user,
      id: task.user_id, // Garante que o user_id seja o mesmo da task
    });

    const sut = new CreateTaskRepository();

    const createTask = await sut.execute(task);

    expect(createTask.user_id).toBeDefined();
    expect(createTask.id).toBeDefined();
    expect(createTask.title).toBe('Teste');
    expect(createTask.description).toBe('Comentário...');
    expect(createTask.status).toBe('TODO');
  });

  test('Deve garantir que o Prisma lançe uma exceção caso não consiga salvar', async () => {
    const sut = new CreateTaskRepository();
    import.meta.jest
      .spyOn(prisma.task, 'create')
      .mockImplementationOnce(new Error()); // Simula um erro no método create

    const promise = sut.execute(task);

    await expect(promise).rejects.toThrow(); // Lança uma exceção
  });
});
