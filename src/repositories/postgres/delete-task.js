import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { prisma } from '../../../prisma/prisma.js';
import { TaskNotFoundError } from '../../errors/index.js';

export class DeleteTaskRepository {
  async execute(taskId) {
    try {
      const task = await prisma.task.delete({
        where: {
          id: taskId,
        },
      });

      return task;
    } catch (error) {
      // Erro específico do Prisma
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
