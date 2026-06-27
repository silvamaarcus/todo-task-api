import { IdGeneratorAdapter } from './id-generator';

describe('IdGeneratorAdapter', () => {
  test('Deve garantir que o IdGeneratorAdapter retorne um uuid', () => {
    const sut = new IdGeneratorAdapter();
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i; // Regex para validar UUID v4

    const result = sut.execute();

    expect(result).toBeTruthy(); // Verifica se o id gerado não é vazio ou nulo
    expect(typeof result).toBe('string'); // Verifica se o id gerado é uma string
    expect(result).toMatch(uuidRegex); // Verifica se o id gerado corresponde ao formato UUID v4
  });
});
