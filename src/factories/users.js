import { IdGeneratorAdapter } from '../adapters/id-generator.js';
import { PasswordHasherAdapter } from '../adapters/password-hasher.js';
import { TokensGeneratorAdapter } from '../adapters/token-generator.js';
import {
  CreateUserController,
  DeleteUserController,
  GetUserByIdController,
  UpdateUserController,
} from '../controllers/index.js';
import {
  CreateUserRepository,
  DeleteUserRepository,
  GetUserByEmailRepository,
  GetUserByIdRepository,
  UpdateUserRepository,
} from '../repositories/postgres/index.js';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from '../use-cases/index.js';

// * Forma de ler: Repository (Banco de Dados) -> UseCase (Regra de Negócio) -> Controller (Requisição HTTP)

// Factory c/ injeção de dependência p/ criar um 'User'
export const makeCreateUserController = () => {
  // 1. Repositories e adapters necessários p/ criar um 'User'
  const getUserByEmailRepository = new GetUserByEmailRepository(); // Verifica e-mail duplicado
  const createUserRepository = new CreateUserRepository(); // Persiste o 'User' no banco de dados
  const idGeneratorAdapter = new IdGeneratorAdapter(); // Gera Id com UUID
  const passwordHasherAdapter = new PasswordHasherAdapter(); // Criptografa a senha
  const tokensGeneratorAdapter = new TokensGeneratorAdapter(); // Gera os tokens JWT
  // 2. Aplica a regra de negócio p/ criar um 'User'
  const createUserUseCase = new CreateUserUseCase(
    getUserByEmailRepository,
    idGeneratorAdapter,
    passwordHasherAdapter,
    createUserRepository,
    tokensGeneratorAdapter,
  );
  // 3. Recebe a requisição p/ criar um 'User' e retorna a resposta
  return new CreateUserController(createUserUseCase);
};

// Factory c/ injeção de dependência p/ obter um 'User' por ID
export const makeGetUserByIdController = () => {
  // 1. Busca o 'User' pelo ID no banco de dados
  const getUserByIdRepository = new GetUserByIdRepository();
  // 2. Aplica a regra de negócio p/ obter o 'User' pelo ID
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);
  // 3. Recebe a requisição p/ obter o 'User' pelo ID e retorna a resposta
  return new GetUserByIdController(getUserByIdUseCase);
};

// Factory c/ injeção de dependência p/ atualizar um 'User'
export const makeUpdateUserController = () => {
  // 1. Repositories e adapters necessários p/ atualizar um 'User'
  const getUserByEmailRepository = new GetUserByEmailRepository(); // Verifica e-mail duplicado
  const updateUserRepository = new UpdateUserRepository(); // Dados atualizados do 'User'
  const passwordHasherAdapter = new PasswordHasherAdapter(); // Criptografa a nova senha, se fornecida
  // 2. Aplica a regra de negócio p/ atualizar um 'User'
  const updateUserUseCase = new UpdateUserUseCase(
    getUserByEmailRepository,
    passwordHasherAdapter,
    updateUserRepository,
  );
  // 3. Recebe a requisição p/ atualizar um 'User' e retorna a resposta
  return new UpdateUserController(updateUserUseCase);
};

// Factory c/ injeção de dependência p/ deletar um 'User'
export const makeDeleteUserController = () => {
  // 1. Repositories necessários p/ deletar um 'User'
  const getUserByIdRepository = new GetUserByIdRepository(); // ID do 'User'
  const deleteUserRepository = new DeleteUserRepository(); // Remove o 'User' do banco de dados
  // 2. Aplica a regra de negócio p/ deletar um 'User'
  const deleteUserUseCase = new DeleteUserUseCase(
    getUserByIdRepository,
    deleteUserRepository,
  );
  // 3. Recebe a requisição p/ deletar um 'User' e retorna a resposta
  return new DeleteUserController(deleteUserUseCase);
};
