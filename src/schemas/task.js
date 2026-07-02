import z from 'zod';

import { TASK_TYPE } from '../constants/index.js';

export const createTaskSchema = z.object({
  user_id: z.string().trim().uuid({
    message: 'ID do usuário inválido!',
  }),
  title: z
    .string()
    .trim()
    .min(3, { message: 'Título deve conter no mínimo 3 caracteres.' }),
  description: z.string().trim().optional(),
  status: z
    .enum([TASK_TYPE.TODO, TASK_TYPE.IN_PROGRESS, TASK_TYPE.DONE], {
      message: `Status inválido! Escolha: ${TASK_TYPE.TODO}, ${TASK_TYPE.IN_PROGRESS} ou ${TASK_TYPE.DONE}`,
    })
    .default(TASK_TYPE.TODO),
});

export const updateTaskSchema = createTaskSchema
  .omit({ user_id: true }) // remove o campo user_id do schema de atualização
  .extend({
    status: z
      .enum([TASK_TYPE.TODO, TASK_TYPE.IN_PROGRESS, TASK_TYPE.DONE], {
        message: `Status inválido! Escolha: ${TASK_TYPE.TODO}, ${TASK_TYPE.IN_PROGRESS} ou ${TASK_TYPE.DONE}`,
      })
      .optional(),
  })
  .partial();
