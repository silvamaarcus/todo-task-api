import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './config/swagger.js';
import { tasksRouter, usersRouter } from './routes/index.js';

const app = express();

app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/tasks/me', tasksRouter);

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js',
    ],
  }),
);

export default app;
