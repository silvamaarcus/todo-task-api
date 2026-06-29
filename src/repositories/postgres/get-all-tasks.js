import { prisma } from '../../../prisma/prisma.js';

export class GetAllTasksRepository {
  async execute(filters = {}) {
    return await prisma.task.findMany({
      where: {
        status: filters.status,
      },
    });
  }
}
