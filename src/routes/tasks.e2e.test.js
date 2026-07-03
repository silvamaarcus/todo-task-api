import request from 'supertest';

import { app } from '../app.js';

// Helper: cria usuário, faz login e retorna token de acesso
const createUserAndLogin = async () => {
  const email = `jdoe@email.com`;
  const password = '123456';

  await request(app).post('/api/users').send({
    name: 'John',
    last_name: 'Doe',
    email,
    password,
  });

  const loginResponse = await request(app).post('/api/users/login').send({
    email,
    password,
  });

  return loginResponse.body.tokens.accessToken;
};

describe('Rotas E2E para Tasks', () => {
  test('POST /api/tasks deve criar uma Task', async () => {
    const accessToken = await createUserAndLogin();

    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Teste', description: 'Descrição' });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Teste');
  });

  test('GET /api/tasks buscar todas as Tasks', async () => {
    const accessToken = await createUserAndLogin();

    // Cria Tasks
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Teste', description: 'Descrição' });
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Teste 2', description: 'Descrição 2' });

    // Busca Tasks
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe('Teste');
    expect(response.body[1].title).toBe('Teste 2');
  });

  test('GET /api/tasks?status=TODO buscar todas as Tasks com filtro TODO', async () => {
    const accessToken = await createUserAndLogin();

    // Cria Tasks
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Teste', description: 'Descrição' });
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Teste 2',
        description: 'Descrição 2',
        status: 'IN_PROGRESS',
      });

    // Busca Tasks com filtro TODO
    const response = await request(app)
      .get('/api/tasks?status=TODO')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test('GET /api/tasks?status=IN_PROGRESS buscar todas as Tasks com filtro IN_PROGRESS', async () => {
    const accessToken = await createUserAndLogin();

    // Cria Tasks
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Teste', description: 'Descrição' });
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Teste 2',
        description: 'Descrição 2',
        status: 'IN_PROGRESS',
      });

    // Busca Tasks com filtro IN_PROGRESS
    const response = await request(app)
      .get('/api/tasks?status=IN_PROGRESS')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test('GET /api/tasks?status=DONE buscar todas as Tasks com filtro DONE', async () => {
    const accessToken = await createUserAndLogin();

    // Cria Tasks
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Teste', description: 'Descrição' });
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Teste 2',
        description: 'Descrição 2',
        status: 'DONE',
      });

    // Busca Tasks com filtro DONE
    const response = await request(app)
      .get('/api/tasks?status=DONE')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test('GET /api/tasks/:id buscar uma Task por ID', async () => {
    const accessToken = await createUserAndLogin();

    // Cria Task
    const task = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Teste', description: 'Descrição' });

    const taskId = task.body.id; // Atribui Id

    // Busca Task com ID na URL
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Teste');
  });

  test('PATCH /api/tasks/:id atualizar uma Task por ID', async () => {
    const accessToken = await createUserAndLogin();

    // Cria Task
    const task = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Teste', description: 'Descrição' });

    const taskId = task.body.id; // Atribui Id
    const updateTaskParams = {
      title: 'Teste atualizado',
      description: 'Descrição atualizada',
    }; // Novos parametros

    // Atualiza Task com ID na URL
    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateTaskParams);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Teste atualizado');
    expect(response.body.description).toBe('Descrição atualizada');
  });

  test('DELETE /api/tasks/:id deletar uma Task por ID', async () => {
    const accessToken = await createUserAndLogin();

    // Cria Task
    const task = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Teste', description: 'Descrição' });

    const taskId = task.body.id; // Atribui Id

    console.log(taskId);

    // Deleta Task com ID na URL
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Teste');
  });
});
