export const tasksDocs = {
  '/api/tasks/me': {
    post: {
      tags: ['Tarefas'],
      summary: 'Criar nova tarefa',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title', 'status'],
              properties: {
                title: { type: 'string', example: 'Comprar leite' },
                description: {
                  type: 'string',
                  example: 'Ir ao supermercado e comprar leite',
                },
                status: {
                  type: 'string',
                  example: 'TODO',
                  enum: ['TODO', 'IN_PROGRESS', 'DONE'],
                },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'Tarefa criada com sucesso' },
        400: { description: 'Dados inválidos' },
        401: { description: 'Não autorizado' },
        500: { description: 'Erro interno do servidor' },
      },
    },
    get: {
      tags: ['Tarefas'],
      summary: 'Listar todas as tarefas do usuário autenticado',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'status',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            enum: ['TODO', 'IN_PROGRESS', 'DONE'],
          },
          description: 'Filtrar tarefas por status',
        },
      ],
      responses: {
        200: { description: 'Lista de tarefas retornada com sucesso' },
        401: { description: 'Não autorizado' },
        500: { description: 'Erro interno do servidor' },
      },
    },
  },
  '/api/tasks/me/{id}': {
    get: {
      tags: ['Tarefas'],
      summary: 'Obter tarefa por ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID da tarefa',
        },
      ],
      responses: {
        200: { description: 'Tarefa encontrada com sucesso' },
        401: { description: 'Não autorizado' },
        404: { description: 'Tarefa não encontrada' },
        500: { description: 'Erro interno do servidor' },
      },
    },
    patch: {
      tags: ['Tarefas'],
      summary: 'Atualizar tarefa por ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID da tarefa',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string', example: 'Comprar leite' },
                description: {
                  type: 'string',
                  example: 'Ir ao supermercado e comprar leite',
                },
                status: {
                  type: 'string',
                  example: 'IN_PROGRESS',
                  enum: ['TODO', 'IN_PROGRESS', 'DONE'],
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Tarefa atualizada com sucesso' },
        400: { description: 'Dados inválidos' },
        401: { description: 'Não autorizado' },
        404: { description: 'Tarefa não encontrada' },
        500: { description: 'Erro interno do servidor' },
      },
    },
    delete: {
      tags: ['Tarefas'],
      summary: 'Deletar tarefa por ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID da tarefa',
        },
      ],
      responses: {
        200: { description: 'Tarefa deletada com sucesso' },
        401: { description: 'Não autorizado' },
        404: { description: 'Tarefa não encontrada' },
        500: { description: 'Erro interno do servidor' },
      },
    },
  },
};
