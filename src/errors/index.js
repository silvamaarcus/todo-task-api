export class TaskNotFoundError extends Error {
  constructor(taskId) {
    super(`Tarefa com ID "${taskId}" não encontrada.`); // Ao usar uma classe extendida, é obrigatório usar o 'super'
    this.name = 'TaskNotFoundError';
  }
}

export class UserNotFoundError extends Error {
  constructor(userId) {
    super(`Usuário com ID "${userId}" não encontrada.`); // Ao usar uma classe extendida, é obrigatório usar o 'super'
    this.name = 'UserNotFoundError';
  }
}

export class EmailAlreadyInUseError extends Error {
  constructor(email) {
    super(`Já existe um usuário com email: ${email}. Tente novamente.`);
    this.name = 'EmailAlreadyInUseError';
  }
}

export class InvalidPasswordError extends Error {
  constructor() {
    super(`Senha inválida. Tente novamente.`);
    this.name = 'InvalidPasswordError';
  }
}
