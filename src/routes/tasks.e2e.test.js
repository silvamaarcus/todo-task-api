import request from 'supertest';

import { app } from '../app.js';

test('POST /api/tasks deve criar uma Task', async () => {
  const response = await request(app)
    .post('/api/tasks')
    .send({ title: 'Teste', description: 'Descrição' });

  expect(response.status).toBe(201);
  expect(response.body.title).toBe('Teste');
});

test('GET /api/tasks buscar todas as Tasks', async () => {
  // Cria Tasks
  await request(app)
    .post('/api/tasks')
    .send({ title: 'Teste', description: 'Descrição' });
  await request(app)
    .post('/api/tasks')
    .send({ title: 'Teste 2', description: 'Descrição 2' });

  // Busca Tasks
  const response = await request(app).get('/api/tasks');

  expect(response.status).toBe(200);
  expect(response.body).toHaveLength(2);
  expect(response.body[0].title).toBe('Teste');
  expect(response.body[1].title).toBe('Teste 2');
});

test('GET /api/tasks?status=TODO buscar todas as Tasks com filtro TODO', async () => {
  // Cria Tasks
  await request(app)
    .post('/api/tasks')
    .send({ title: 'Teste', description: 'Descrição' });
  await request(app).post('/api/tasks').send({
    title: 'Teste 2',
    description: 'Descrição 2',
    status: 'IN_PROGRESS',
  });

  // Busca Tasks com filtro TODO
  const response = await request(app).get('/api/tasks?status=TODO');

  expect(response.status).toBe(200);
  expect(response.body).toHaveLength(1);
  expect(response.body[0].status).toBe('TODO');
});

test('GET /api/tasks?status=IN_PROGRESS buscar todas as Tasks com filtro IN_PROGRESS', async () => {
  // Cria Tasks
  await request(app)
    .post('/api/tasks')
    .send({ title: 'Teste', description: 'Descrição' });
  await request(app).post('/api/tasks').send({
    title: 'Teste 2',
    description: 'Descrição 2',
    status: 'IN_PROGRESS',
  });

  // Busca Tasks com filtro IN_PROGRESS
  const response = await request(app).get('/api/tasks?status=IN_PROGRESS');

  expect(response.status).toBe(200);
  expect(response.body).toHaveLength(1);
  expect(response.body[0].status).toBe('IN_PROGRESS');
});

test('GET /api/tasks?status=DONE buscar todas as Tasks com filtro DONE', async () => {
  // Cria Tasks
  await request(app)
    .post('/api/tasks')
    .send({ title: 'Teste', description: 'Descrição' });
  await request(app).post('/api/tasks').send({
    title: 'Teste 2',
    description: 'Descrição 2',
    status: 'DONE',
  });

  // Busca Tasks com filtro DONE
  const response = await request(app).get('/api/tasks?status=DONE');

  expect(response.status).toBe(200);
  expect(response.body).toHaveLength(1);
  expect(response.body[0].status).toBe('DONE');
});

test('GET /api/tasks/:id buscar uma Task por ID', async () => {
  // Cria Tasks
  const task = await request(app)
    .post('/api/tasks')
    .send({ title: 'Teste', description: 'Descrição' });

  const taskId = task.body.id; // Atribui Id

  // Busca Task com ID na URL
  const response = await request(app).get(`/api/tasks/${taskId}`);

  expect(response.status).toBe(200);
  expect(response.body.title).toBe('Teste');
});

test('PATCH /api/tasks/:id atualizar uma Task por ID', async () => {
  // Cria Tasks
  const task = await request(app)
    .post('/api/tasks')
    .send({ title: 'Teste', description: 'Descrição' });

  const taskId = task.body.id; // Atribui Id
  const updateTaskParams = {
    title: 'Teste atualizado',
    description: 'Descrição atualizada',
  }; // Novos parametros

  // Atualiza Task com ID na URL
  const response = await request(app)
    .patch(`/api/tasks/${taskId}`)
    .send(updateTaskParams);

  expect(response.status).toBe(200);
  expect(response.body.title).toBe('Teste atualizado');
  expect(response.body.description).toBe('Descrição atualizada');
});

test('Delete /api/tasks/:id deletar uma Task por ID', async () => {
  // Cria Tasks
  const task = await request(app)
    .post('/api/tasks')
    .send({ title: 'Teste', description: 'Descrição' });

  const taskId = task.body.id; // Atribui Id

  // Deleta Task com ID na URL
  const response = await request(app).delete(`/api/tasks/${taskId}`);

  expect(response.status).toBe(200);
  expect(response.body.title).toBe('Teste');
});
