import { prisma } from '../../../../prisma/prisma';

export class CreateUserRepository {
  async execute(createUserParams) {
    const user = await prisma.create({
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
