import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { prisma } from '../../../../prisma/prisma.js';
import { TaskNotFoundError } from '../../../errors/index.js';

export class UpdateTaskRepository {
  async execute(taskId, userId, updateTaskParams) {
    try {
      const task = await prisma.task.update({
        where: {
          user_id: userId,
          id: taskId,
        },
        data: updateTaskParams,
      });

      return task;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // P2025 -> é o código de erro do Prisma que indica que o registro (task) não foi encontrado.
        if (error.code === 'P2025') {
          throw new TaskNotFoundError(taskId);
        }
      }

      throw error; // Para outros erros, relança o erro.
    }
  }
}
