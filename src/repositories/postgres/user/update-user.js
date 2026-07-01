import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { prisma } from '../../../../prisma/prisma.js';
import { UserNotFoundError } from '../../../errors/index.js';

export class UpdateUserRepository {
  async execute(userId, updateUserParams) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: updateUserParams,
      });

      return user;
    } catch (error) {
      // Erro específico do Prisma
      if (error instanceof PrismaClientKnownRequestError) {
        // P2025 -> é o código de erro do Prisma que indica que o registro (usuário) não foi encontrado.
        if (error.code === 'P2025') {
          throw new UserNotFoundError(userId);
        }
      }

      throw error; // Para outros erros, relança o erro.
    }
  }
}
