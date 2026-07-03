import { prisma } from '../../../../prisma/prisma.js';

export class GetTaskByIdRepository {
  async execute(taskId, userId) {
    const task = await prisma.task.findUnique({
      where: {
        user_id: userId,
        id: taskId,
      },
    });

    return task;
  }
}
