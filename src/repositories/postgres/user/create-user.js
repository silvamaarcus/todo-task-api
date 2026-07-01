import { prisma } from '../../../../prisma/prisma.js';

export class CreateUserRepository {
  async execute(createUserParams) {
    const user = await prisma.user.create({
      data: {
        id: createUserParams.id,
        name: createUserParams.name,
        last_name: createUserParams.last_name,
        email: createUserParams.email,
        password: createUserParams.password,
      },
    });

    return user;
  }
}
