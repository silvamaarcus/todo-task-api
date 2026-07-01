import { prisma } from '../../../../prisma/prisma.js';

export class GetTaskByIdRepository {
  async execute(taskId) {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    return task;
  }
}
