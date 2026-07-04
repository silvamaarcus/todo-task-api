import request from 'supertest';

import app from '../app.js';

describe('Rotas E2E para Tasks', () => {
  test('POST /api/users deve criar um usuário', async () => {
    const response = await request(app).post('/api/users').send({
      name: 'Marcus',
      last_name: 'Silva',
      email: 'marcus@email.com',
      password: '123456',
    });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Marcus');
    expect(response.body.last_name).toBe('Silva');
  });

  test('GET /api/users/:userId deve buscar um usuário pelo ID', async () => {
    // Cria um usuário
    const createResponse = await request(app).post('/api/users').send({
      name: 'Marcus',
      last_name: 'Silva',
      email: 'marcus@email.com',
      password: '123456',
    });

    // Busca o usuário pelo ID
    const userId = createResponse.body.id;

    const response = await request(app).get(`/api/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Marcus');
    expect(response.body.last_name).toBe('Silva');
  });

  test('PATCH /api/users/:userId deve atualizar o nome e o sobronome de um usuário pelo ID', async () => {
    // Cria um usuário
    const createResponse = await request(app).post('/api/users').send({
      name: 'Marcus',
      last_name: 'Silva',
      email: 'marcus@email.com',
      password: '123456',
    });

    // Busca o usuário pelo ID
    const userId = createResponse.body.id;

    const updateUsersParams = {
      ...createResponse,
      name: 'Marcus Vinicius',
      last_name: 'Costa Silva',
    };

    // Atualiza um usuário
    const response = await request(app)
      .patch(`/api/users/${userId}`)
      .send(updateUsersParams);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Marcus Vinicius');
    expect(response.body.last_name).toBe('Costa Silva');
  });

  test('PATCH /api/users/:userId deve atualizar o email de um usuário pelo ID', async () => {
    // Cria um usuário
    const createResponse = await request(app).post('/api/users').send({
      name: 'Marcus',
      last_name: 'Silva',
      email: 'alecrim@email.com',
      password: '123456',
    });

    // Busca o usuário pelo ID
    const userId = createResponse.body.id;

    const updateUsersParams = {
      ...createResponse,
      email: 'alecrim10@email.com',
    };

    // Atualiza um usuário
    const response = await request(app)
      .patch(`/api/users/${userId}`)
      .send(updateUsersParams);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('alecrim10@email.com');
  });

  test('PATCH /api/users/:userId deve atualizar o password de um usuário pelo ID', async () => {
    // Cria um usuário
    const createResponse = await request(app).post('/api/users').send({
      name: 'Marcus',
      last_name: 'Silva',
      email: 'alecrim@email.com',
      password: '123456',
    });

    // Busca o usuário pelo ID
    const userId = createResponse.body.id;

    const updateUsersParams = {
      ...createResponse,
      password: 'nova_senha',
    };

    // Atualiza um usuário
    const response = await request(app)
      .patch(`/api/users/${userId}`)
      .send(updateUsersParams);

    expect(response.status).toBe(200);
  });

  test('DELETE /api/users/:userId deve deletar um usuário pelo ID', async () => {
    // Cria um usuário
    const createResponse = await request(app).post('/api/users').send({
      name: 'Marcus',
      last_name: 'Silva',
      email: 'marcus@email.com',
      password: '123456',
    });

    // Busca o usuário pelo ID
    const userId = createResponse.body.id;

    // Deleta um usuário
    const response = await request(app).get(`/api/users/${userId}`);

    expect(response.status).toBe(200);
  });

  //* =========== LOGIN ===========

  test('POST /api/users/login deve autenticar um usuário e retornar um token', async () => {
    // Cria um usuário
    await request(app).post('/api/users').send({
      name: 'Marcus',
      last_name: 'Silva',
      email: 'marcus@email.com',
      password: '123456',
    });

    // Autentica o usuário
    const response = await request(app).post('/api/users/login').send({
      email: 'marcus@email.com',
      password: '123456',
    });

    expect(response.status).toBe(200);
    expect(response.body.tokens).toHaveProperty('accessToken');
    expect(response.body.tokens).toHaveProperty('refreshToken');
  });
});
