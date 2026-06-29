export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!**/node_modules/**',
  ],
  setupFilesAfterEnv: ['./src/tests/setup.js'],
  maxWorkers: 1, // Executa testes sequencialmente para evitar conflitos no banco
  testEnvironmentOptions: {
    env: {
      DATABASE_URL:
        'postgresql://postgres:password@localhost:5433/todo-task-test',
    },
  },
  // Ignora mudanças em arquivos que não sejam de teste
  watchPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '.*\\.(?!test\\.js$)[^.]+\\.js$', // Ignora arquivos .js que não sejam .test.js
  ],
};
