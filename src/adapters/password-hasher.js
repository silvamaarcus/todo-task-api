import bcrypt from 'bcrypt';

export class PasswordHasherAdapter {
  async execute(password) {
    return bcrypt.hash(password, 10); // O 10 é o número de rounds de hashing: Exem
  }
}
