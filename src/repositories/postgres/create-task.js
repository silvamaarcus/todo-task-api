import { prisma } from '../../../prisma/prisma.js';

export class CreateTaskRepository {
  async execute(createTaskParams) {
    const task = await prisma.task.create({
      data: {
        title: createTaskParams.title,
        description: createTaskParams.description,
      },
    });

    return task;
  }
}
