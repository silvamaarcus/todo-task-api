import { faker } from '@faker-js/faker';

export const task = {
  id: faker.string.uuid(),
  title: 'Teste',
  description: 'Comentário...',
  status: 'TODO',
};

export const newTask = {
  id: faker.string.uuid(),
  title: 'Novo Teste',
  description: 'Comentário editato!',
  status: 'IN_PROGRESS',
};

export const tasks = [
  {
    id: faker.string.uuid(),
    title: 'Tarefa teste 1',
    description: 'Descrição da tarefa teste 1',
    status: 'TODO',
  },
  {
    id: faker.string.uuid(),
    title: 'Tarefa teste 2',
    description: 'Descrição da tarefa teste 2',
    status: 'IN_PROGRESS',
  },
  {
    id: faker.string.uuid(),
    title: 'Tarefa teste 3',
    description: 'Descrição da tarefa teste 3',
    status: 'COMPLETED',
  },
];
