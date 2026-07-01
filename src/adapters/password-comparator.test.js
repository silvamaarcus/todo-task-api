import { PasswordComparatorAdapter } from './password-comparator';
import { PasswordHasherAdapter } from './password-hasher';

describe('PasswordHasherAdapter', () => {
  test('Deve comparar senha com hash', async () => {
    const hasher = new PasswordHasherAdapter();
    const password = '123456';
    const hasherPassword = await hasher.execute(password);
    const sut = new PasswordComparatorAdapter();

    const result = await sut.execute(password, hasherPassword);

    expect(result).toBe(true); // Verifica se a senha corresponde ao hash
  });
});
