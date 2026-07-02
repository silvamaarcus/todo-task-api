import jwt from 'jsonwebtoken';

// Verifica se o usuário está autenticado
export const auth = (req, res, next) => {
  try {
    // obter o acessToken(JWT) do header
    const accessToken = req.headers?.authorization?.split('Bearer ')[1]; // Pega somente o token, removendo o "Bearer " do início.

    // verificar se acessToken é valido
    if (!accessToken) {
      return res
        .status(401)
        .send({ message: 'Sem autorização para esse recurso.' });
    }

    // verificar o token usando a chave secreta definida nas variáveis de ambiente.
    const decodedToken = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET,
    );

    if (!decodedToken) {
      return res
        .status(401)
        .send({ message: 'Sem autorização para esse recurso.' });
    }

    req.userId = decodedToken.userId; // pegar o userId do token decodificado

    // se for valido, chama o next() para permitir o acesso à rota
    next();
  } catch (error) {
    console.log(error);

    return res.status(401).send({ message: 'Unauthorized!' });
  }
};
