export class TaskNotFoundError extends Error {
  constructor(taskId) {
    super(`Tarefa com ID "${taskId}" não encontrada.`); // Ao usar uma classe extendida, é obrigatório usar o 'super'
    this.name = 'TaskNotFoundError';
  }
}
