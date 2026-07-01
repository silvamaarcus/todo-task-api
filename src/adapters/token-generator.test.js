import { TokensGeneratorAdapter } from './token-generator.js';

describe('TokensGeneratorAdapter', () => {
  test('Deve garantir que o TokensGeneratorAdapter retorne um accessToken e refreshToken', async () => {
    const sut = new TokensGeneratorAdapter();
    const result = await sut.execute();

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });
});
