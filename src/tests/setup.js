import { prisma } from '../../prisma/prisma.js';

beforeEach(async () => {
  await prisma.user.deleteMany();
  await prisma.task.deleteMany();
});

afterEach(async () => {
  await prisma.user.deleteMany();
  await prisma.task.deleteMany();
});
