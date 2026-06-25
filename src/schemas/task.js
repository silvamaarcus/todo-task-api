import z from 'zod';

import { TASK_TYPE } from '../constants';

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: 'Título deve conter no mínimo 3 caracteres.' }),
  description: z.string().trim().optional(),
});

export const updateTaskSchema = createTaskSchema.extend({
  status: z
    .enum([TASK_TYPE.TODO, TASK_TYPE.IN_PROGRESS, TASK_TYPE.DONE], {
      errorMap: () => ({
        message: `O tipo só pode ser ${TASK_TYPE.TODO}, ${TASK_TYPE.IN_PROGRESS} ou ${TASK_TYPE.DONE}`,
      }),
    })
    .optional(),
});
