import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { prisma } from '../../../../prisma/prisma.js';
import { UserNotFoundError } from '../../../errors/index.js';

export class DeleteUserRepository {
  async execute(userId) {
    try {
      const user = await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      return `O usuário ${user.email} foi deletado com sucesso.`;
    } catch (error) {
      // Erro específico do Prisma
      if (error instanceof PrismaClientKnownRequestError) {
        // P2025 -> é o código de erro do Prisma que indica que o registro (user) não foi encontrado.
        if (error.code === 'P2025') {
          throw new UserNotFoundError(userId);
        }
      }

      throw error; // Para outros erros, relança o erro.
    }
  }
}
