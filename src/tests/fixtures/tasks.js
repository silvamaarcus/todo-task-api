import { faker } from '@faker-js/faker';

export const task = {
  user_id: '59763d79-fee1-4bdb-ab27-ff8a690744fa',
  id: faker.string.uuid(),
  title: 'Teste',
  description: 'Comentário...',
  status: 'TODO',
};

export const newTask = {
  user_id: '59763d79-fee1-4bdb-ab27-ff8a690744fa',
  id: faker.string.uuid(),
  title: 'Novo Teste',
  description: 'Comentário editato!',
  status: 'IN_PROGRESS',
};

export const tasks = [
  {
    user_id: '59763d79-fee1-4bdb-ab27-ff8a690744fa',
    id: faker.string.uuid(),
    title: 'Tarefa teste 1',
    description: 'Descrição da tarefa teste 1',
    status: 'TODO',
  },
  {
    user_id: '59763d79-fee1-4bdb-ab27-ff8a690744fa',
    id: faker.string.uuid(),
    title: 'Tarefa teste 2',
    description: 'Descrição da tarefa teste 2',
    status: 'IN_PROGRESS',
  },
  {
    user_id: '59763d79-fee1-4bdb-ab27-ff8a690744fa',
    id: faker.string.uuid(),
    title: 'Tarefa teste 3',
    description: 'Descrição da tarefa teste 3',
    status: 'DONE',
  },
];
