import express from 'express';

import { tasksRouter, usersRouter } from './routes/index.js';

const app = express();

app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/tasks/me', tasksRouter);

export default app;
