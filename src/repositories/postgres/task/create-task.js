import { prisma } from '../../../../prisma/prisma.js';

export class CreateTaskRepository {
  async execute(createTaskParams) {
    const task = await prisma.task.create({
      data: {
        user_id: createTaskParams.user_id,
        id: createTaskParams.id,
        title: createTaskParams.title,
        description: createTaskParams.description,
        status: createTaskParams.status,
      },
    });

    return task;
  }
}
