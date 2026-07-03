import { prisma } from '../../../../prisma/prisma.js';

export class GetAllTasksRepository {
  async execute(filters = {}) {
    return await prisma.task.findMany({
      where: {
        user_id: filters.user_id,
        status: filters.status,
      },
    });
  }
}
