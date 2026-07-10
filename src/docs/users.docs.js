export const usersDocs = {
  '/api/users': {
    post: {
      tags: ['Usuários'],
      summary: 'Registrar novo usuário',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'last_name', 'email', 'password'],
              properties: {
                name: { type: 'string', example: 'Marcus' },
                last_name: { type: 'string', example: 'Silva' },
                email: { type: 'string', example: 'marcus@email.com' },
                password: { type: 'string', example: '123456' },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'Usuário criado com sucesso' },
        400: { description: 'Dados inválidos' },
        409: { description: 'Email já cadastrado' },
        500: { description: 'Erro interno do servidor' },
      },
    },
  },
  '/api/users/login': {
    post: {
      tags: ['Usuários'],
      summary: 'Fazer login',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', example: 'marcus@email.com' },
                password: { type: 'string', example: '123456' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Login realizado com sucesso' },
        400: { description: 'Dados inválidos' },
        401: { description: 'Credenciais inválidas' },
        500: { description: 'Erro interno do servidor' },
      },
    },
  },
  '/api/users/{id}': {
    get: {
      tags: ['Usuários'],
      summary: 'Obter usuário por ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID do usuário',
        },
      ],
      responses: {
        200: { description: 'Usuário encontrado com sucesso' },
        404: { description: 'Usuário não encontrado' },
        500: { description: 'Erro interno do servidor' },
      },
    },
    patch: {
      tags: ['Usuários'],
      summary: 'Atualizar usuário por ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID do usuário',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Marcus' },
                last_name: { type: 'string', example: 'Silva' },
                email: { type: 'string', example: ' email@email.com' },
                password: { type: 'string', example: '123456' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Usuário atualizado com sucesso' },
        400: { description: 'Dados inválidos' },
        404: { description: 'Usuário não encontrado' },
        500: { description: 'Erro interno do servidor' },
      },
    },
    delete: {
      tags: ['Usuários'],
      summary: 'Deletar usuário por ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID do usuário',
        },
      ],
      responses: {
        200: { description: 'Usuário deletado com sucesso' },
        404: { description: 'Usuário não encontrado' },
        500: { description: 'Erro interno do servidor' },
      },
    },
  },
};
