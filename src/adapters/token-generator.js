import jwt from 'jsonwebtoken';

//* JWT ->  Token para controlar autenticação do usuário

export class TokensGeneratorAdapter {
  execute(userId) {
    return {
      // accessToken -> token de acesso (curta duração). Usado para acessar as rotas protegidas.
      accessToken: jwt.sign({ userId }, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: '15m', // tempo de expiração do token - 15 minutos
      }),
      // refreshToken -> token de atualização (longa duração). Usado para gerar um novo 'accessToken' sem precisar fazer login novamente.
      refreshToken: jwt.sign({ userId }, process.env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: '30d', // tempo de expiração do token - 30 dias
      }),
    };
  }
}
