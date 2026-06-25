/**
 *  Função para retornar uma resposta HTTP com status 200 (OK).
 *  Indica que a requisição foi bem-sucedida e o recurso solicitado foi encontrado.
 *  @param {any} body - O corpo da resposta.
 *  @returns {object} - Objeto contendo o statusCode e o corpo da resposta.
 */
export const ok = (body) => {
  return {
    statusCode: 200,
    body,
  };
};

/**
 *  Função para retornar uma resposta HTTP com status 201 (Created).
 *  Indica que a requisição foi bem-sucedida e um novo recurso foi criado.
 *  @param {any} body - O corpo da resposta.
 *  @returns {object} - Objeto contendo o statusCode e o corpo da resposta.
 */
export const created = (body) => {
  return {
    statusCode: 201,
    body,
  };
};

/**
 * Função para retornar uma resposta HTTP com status 400 (Bad Request).
 * Indica que a requisição foi mal formulada ou contém erros nos parâmetros.
 * @param {any} body - O corpo da resposta.
 * @returns {object} - Objeto contendo o statusCode e o corpo da resposta.
 */
export const badRequest = (body) => {
  return {
    statusCode: 400,
    body,
  };
};

/**
 * Função para retornar uma resposta HTTP com status 404 (Not Found).
 * Indica que o recurso solicitado não foi encontrado no servidor.
 * @param {any} body - O corpo da resposta.
 * @returns {object} - Objeto contendo o statusCode e o corpo da resposta.
 */
export const notFound = (body) => {
  return {
    statusCode: 404,
    body,
  };
};

/**
 * Função para retornar uma resposta HTTP com status 500 (Internal Server Error).
 * Indica que ocorreu um erro interno no servidor ao processar a requisição.
 * @param {any} body - O corpo da resposta.
 * @returns {object} - Objeto contendo o statusCode e o corpo da resposta.
 */
export const serverError = () => {
  return {
    statusCode: 500,
    body: {
      message: 'Internal server error',
    },
  };
};
