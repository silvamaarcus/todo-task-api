import swaggerJsdoc from 'swagger-jsdoc';

import { usersDocs } from '../docs/users.docs.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo Task API',
      version: '1.0.0',
      description: 'API de gerenciamento de tarefas com autenticação JWT',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    paths: {
      ...usersDocs,
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
