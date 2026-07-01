import { PasswordHasherAdapter } from './password-hasher';

describe('PasswordHasherAdapter', () => {
  test('Deve garantir que o PasswordHasherAdapter execute o hash na senha e retorne', async () => {
    const sut = new PasswordHasherAdapter();
    const password = '123456';

    const result = await sut.execute(password);

    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result).not.toBe('123456');
  });
});
