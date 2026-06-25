import { prisma } from '../../../prisma/prisma.js';

export class GetAllTasksRepository {
  async execute() {
    return await prisma.task.findMany();
  }
}
