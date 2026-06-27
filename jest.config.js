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
};
