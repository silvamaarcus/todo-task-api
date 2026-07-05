# todo-task-api

![CI/CD](https://github.com/silvamaarcus/todo-task-api/actions/workflows/ci.yml/badge.svg)

> API REST de gerenciamento de tarefas construída com Node.js, Express e PostgreSQL.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Endpoints](#endpoints)
  - [Usuários](#usuários)
  - [Tarefas](#tarefas)
- [Testes](#testes)
- [CI/CD](#cicd)
- [Deploy](#deploy)

---

## Visão Geral

O **todo-task-api** é uma API REST que permite gerenciar tarefas pessoais. Com ela é possível:

- Criar e autenticar usuários
- Criar, listar, buscar, atualizar e deletar tarefas vinculadas ao usuário autenticado
- Filtrar tarefas pelo status (`TODO`, `IN_PROGRESS`, `DONE`)

A autenticação é feita via **JWT** (JSON Web Token): ao fazer login, o usuário recebe um token de acesso que deve ser enviado nas requisições protegidas.

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Para que serve |
|---|---|---|
| **Node.js** | v22 | Ambiente de execução JavaScript no servidor |
| **Express** | v5 | Framework para criar rotas e lidar com requisições HTTP |
| **PostgreSQL** | latest | Banco de dados relacional onde os dados são armazenados |
| **Prisma** | v5 | ORM que facilita a comunicação com o banco de dados usando código JavaScript |
| **JWT** | — | Sistema de autenticação sem estado usando tokens assinados digitalmente |
| **Zod** | v4 | Biblioteca de validação de dados — garante que os dados enviados pela API estão corretos |
| **bcrypt** | v6 | Criptografia de senhas — nunca armazenamos senha em texto puro |
| **Jest + Supertest** | — | Ferramentas para escrever e executar testes automatizados |
| **Docker** | — | Sobe o banco de dados PostgreSQL localmente sem precisar instalar o Postgres na máquina |
| **Vercel** | — | Plataforma de deploy onde a API está hospedada em produção |
| **GitHub Actions** | — | Automatiza testes e deploy a cada atualização no código |

---

## Arquitetura

O projeto segue os princípios da **Clean Architecture**, organizando o código em camadas com responsabilidades bem definidas. Isso facilita a manutenção e os testes.

```
Requisição HTTP
     │
     ▼
 Controller  ──► valida os dados da requisição com Zod
     │
     ▼
  Use Case   ──► aplica as regras de negócio
     │
     ▼
 Repository  ──► acessa o banco de dados via Prisma
     │
     ▼
   Factory   ──► monta (instancia) Controller + Use Case + Repository juntos
```

### Descrição de cada camada

- **Controller** (`src/controllers/`): Recebe a requisição HTTP, valida os dados usando Zod e chama o Use Case. Retorna a resposta ao cliente.
- **Use Case** (`src/use-cases/`): Contém a lógica de negócio da aplicação (ex.: "para criar uma tarefa, o usuário deve estar autenticado e fornecer um título").
- **Repository** (`src/repositories/`): É a única camada que fala diretamente com o banco de dados usando o Prisma. Abstrai as queries SQL.
- **Factory** (`src/factories/`): Função que monta as dependências — cria o Repository, injeta no Use Case, injeta no Controller e retorna o Controller pronto para uso.
- **Adapter** (`src/adapters/`): Adaptadores para serviços externos (ex.: JWT, bcrypt), isolando o resto da aplicação dessas dependências.

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado na sua máquina:

- [Node.js v22+](https://nodejs.org/)
- [Docker e Docker Compose](https://docs.docker.com/get-docker/)
- [Git](https://git-scm.com/)

---

## Como Rodar Localmente

### 1. Clone o repositório

```bash
git clone https://github.com/silvamaarcus/todo-task-api.git
cd todo-task-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com as suas configurações (veja a seção [Variáveis de Ambiente](#variáveis-de-ambiente)).

Para gerar chaves secretas seguras para o JWT, rode o comando abaixo **duas vezes** (uma para cada chave):

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Suba o banco de dados com Docker

```bash
docker-compose up -d
```

Isso vai criar dois containers PostgreSQL:
- `todo-task-postgres` na porta `5432` — banco principal
- `todo-task-postgres-test` na porta `5433` — banco de testes

### 5. Execute as migrations do banco de dados

As migrations criam as tabelas no banco de dados:

```bash
npx prisma migrate deploy
```

### 6. Inicie o servidor

```bash
npm run dev
```

A API estará disponível em `http://localhost:8080`.

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as variáveis abaixo:

```env
# URL de conexão com o banco de dados PostgreSQL
# Formato: postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO
DATABASE_URL="postgresql://postgres:password@localhost:5432/todo-task"

# Chave secreta para assinar o access token JWT
# Use uma string longa e aleatória — nunca compartilhe!
JWT_ACCESS_TOKEN_SECRET="sua_chave_secreta_aqui"

# Chave secreta para assinar o refresh token JWT
# Deve ser diferente da chave do access token
JWT_REFRESH_TOKEN_SECRET="sua_outra_chave_secreta_aqui"

# Porta em que o servidor vai rodar
PORT=8080
```

> **Importante:** Nunca comite o arquivo `.env` com valores reais no repositório. O `.gitignore` já está configurado para ignorá-lo.

---

## Endpoints

### Base URL

- **Local:** `http://localhost:8080`
- **Produção:** `https://todo-task-api.vercel.app`

### Autenticação

Os endpoints protegidos exigem o header `Authorization` com o token JWT:

```
Authorization: Bearer <seu_token_jwt>
```

O token é obtido ao fazer login na rota `POST /api/users/login`.

---

### Usuários

#### `POST /api/users` — Registrar novo usuário

Cria uma nova conta de usuário.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "João",
  "last_name": "Silva",
  "email": "joao.silva@email.com",
  "password": "minhasenha123"
}
```

**Resposta de sucesso** `201 Created`:
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "João",
  "last_name": "Silva",
  "email": "joao.silva@email.com",
  "created_at": "2024-01-15"
}
```

**Possíveis erros:**

| Status | Descrição |
|--------|-----------|
| `400 Bad Request` | Dados inválidos (ex.: e-mail malformado, senha com menos de 6 caracteres) |
| `409 Conflict` | E-mail já cadastrado |
| `500 Internal Server Error` | Erro interno no servidor |

---

#### `POST /api/users/login` — Fazer login

Autentica o usuário e retorna um token JWT para uso nas próximas requisições.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "joao.silva@email.com",
  "password": "minhasenha123"
}
```

**Resposta de sucesso** `200 OK`:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Possíveis erros:**

| Status | Descrição |
|--------|-----------|
| `400 Bad Request` | Dados inválidos (ex.: e-mail malformado) |
| `401 Unauthorized` | E-mail ou senha incorretos |
| `500 Internal Server Error` | Erro interno no servidor |

---

### Tarefas

> Todos os endpoints de tarefas são protegidos e exigem autenticação via Bearer Token.

---

#### `POST /api/tasks/me` — Criar tarefa

Cria uma nova tarefa para o usuário autenticado.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <seu_token_jwt>
```

**Body:**
```json
{
  "title": "Estudar Clean Architecture",
  "description": "Ler o livro e aplicar os conceitos no projeto",
  "status": "TODO"
}
```

> O campo `description` é opcional. O campo `status` é opcional — padrão: `TODO`.
> Valores aceitos para `status`: `TODO`, `IN_PROGRESS`, `DONE`.

**Resposta de sucesso** `201 Created`:
```json
{
  "id": "f1e2d3c4-b5a6-7890-fedc-ba9876543210",
  "title": "Estudar Clean Architecture",
  "description": "Ler o livro e aplicar os conceitos no projeto",
  "status": "TODO",
  "created_at": "2024-01-15",
  "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Possíveis erros:**

| Status | Descrição |
|--------|-----------|
| `400 Bad Request` | Dados inválidos (ex.: título com menos de 3 caracteres, status inválido) |
| `401 Unauthorized` | Token ausente ou inválido |
| `500 Internal Server Error` | Erro interno no servidor |

---

#### `GET /api/tasks/me` — Listar tarefas

Retorna todas as tarefas do usuário autenticado. É possível filtrar pelo status usando query parameter.

**Headers:**
```
Authorization: Bearer <seu_token_jwt>
```

**Query Parameters (opcionais):**

| Parâmetro | Tipo | Descrição | Exemplo |
|---|---|---|---|
| `status` | string | Filtra tarefas pelo status | `?status=TODO` |

**Exemplo de requisição com filtro:**
```
GET /api/tasks/me?status=IN_PROGRESS
```

**Resposta de sucesso** `200 OK`:
```json
[
  {
    "id": "f1e2d3c4-b5a6-7890-fedc-ba9876543210",
    "title": "Estudar Clean Architecture",
    "description": "Ler o livro e aplicar os conceitos no projeto",
    "status": "TODO",
    "created_at": "2024-01-15",
    "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  },
  {
    "id": "c4d3e2f1-a6b5-0987-cdef-012345678901",
    "title": "Configurar CI/CD",
    "description": null,
    "status": "DONE",
    "created_at": "2024-01-14",
    "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
]
```

**Possíveis erros:**

| Status | Descrição |
|--------|-----------|
| `401 Unauthorized` | Token ausente ou inválido |
| `500 Internal Server Error` | Erro interno no servidor |

---

#### `GET /api/tasks/me/:id` — Buscar tarefa por ID

Retorna os dados de uma tarefa específica do usuário autenticado.

**Headers:**
```
Authorization: Bearer <seu_token_jwt>
```

**Parâmetros de rota:**

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `id` | UUID | ID da tarefa |

**Resposta de sucesso** `200 OK`:
```json
{
  "id": "f1e2d3c4-b5a6-7890-fedc-ba9876543210",
  "title": "Estudar Clean Architecture",
  "description": "Ler o livro e aplicar os conceitos no projeto",
  "status": "TODO",
  "created_at": "2024-01-15",
  "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Possíveis erros:**

| Status | Descrição |
|--------|-----------|
| `401 Unauthorized` | Token ausente ou inválido |
| `404 Not Found` | Tarefa não encontrada |
| `500 Internal Server Error` | Erro interno no servidor |

---

#### `PATCH /api/tasks/me/:id` — Atualizar tarefa

Atualiza parcialmente uma tarefa do usuário autenticado. Envie apenas os campos que deseja alterar.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <seu_token_jwt>
```

**Parâmetros de rota:**

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `id` | UUID | ID da tarefa |

**Body (todos os campos são opcionais):**
```json
{
  "title": "Estudar Clean Architecture - Atualizado",
  "status": "IN_PROGRESS"
}
```

**Resposta de sucesso** `200 OK`:
```json
{
  "id": "f1e2d3c4-b5a6-7890-fedc-ba9876543210",
  "title": "Estudar Clean Architecture - Atualizado",
  "description": "Ler o livro e aplicar os conceitos no projeto",
  "status": "IN_PROGRESS",
  "created_at": "2024-01-15",
  "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Possíveis erros:**

| Status | Descrição |
|--------|-----------|
| `400 Bad Request` | Dados inválidos (ex.: status inválido) |
| `401 Unauthorized` | Token ausente ou inválido |
| `404 Not Found` | Tarefa não encontrada |
| `500 Internal Server Error` | Erro interno no servidor |

---

#### `DELETE /api/tasks/me/:id` — Deletar tarefa

Remove permanentemente uma tarefa do usuário autenticado.

**Headers:**
```
Authorization: Bearer <seu_token_jwt>
```

**Parâmetros de rota:**

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `id` | UUID | ID da tarefa |

**Resposta de sucesso** `200 OK`:
```json
{
  "message": "Tarefa deletada com sucesso."
}
```

**Possíveis erros:**

| Status | Descrição |
|--------|-----------|
| `401 Unauthorized` | Token ausente ou inválido |
| `404 Not Found` | Tarefa não encontrada |
| `500 Internal Server Error` | Erro interno no servidor |

---

## Testes

O projeto possui dois tipos de testes:

### Testes Unitários

Testam cada Controller de forma isolada, verificando se ele valida corretamente os dados e retorna os status HTTP esperados. Estão localizados junto aos arquivos de Controller (ex.: `create-task.test.js`).

### Testes de Integração (E2E)

Testam os fluxos completos da API do início ao fim, simulando requisições HTTP reais contra um banco de dados de teste. Estão localizados em `src/routes/tasks.e2e.test.js` e `src/routes/users.e2e.test.js`.

### Como executar os testes

> **Atenção:** Certifique-se de que o container `todo-task-postgres-test` (porta 5433) está rodando antes de executar os testes.

```bash
# Sobe apenas o banco de testes
docker-compose up -d postgres-test

# Roda todos os testes
npm test

# Roda os testes com relatório de cobertura de código
npm run test:cov
```

O relatório de cobertura será gerado na pasta `coverage/`.

---

## CI/CD

O projeto utiliza **GitHub Actions** com um workflow definido em `.github/workflows/main.yml`. A pipeline é acionada automaticamente em:

- **Push** para a branch `main`
- **Pull Request** para a branch `main`

### Etapas da Pipeline

```
┌─────────────────── Job: check ───────────────────┐
│  1. Checkout do código                            │
│  2. Configuração do Node.js v22                  │
│  3. Criação do arquivo .env.test                  │
│  4. Instalação das dependências (npm ci)          │
│  5. Execução das migrations do banco de testes    │
│  6. ESLint — verificação de qualidade do código   │
│  7. Prettier — verificação de formatação          │
│  8. Testes automatizados                          │
└───────────────────────────────────────────────────┘
          │
          │ (somente se check passou E é push na main)
          ▼
┌─────────────────── Job: deploy ──────────────────┐
│  1. Checkout do código                            │
│  2. Deploy para Vercel (produção)                 │
└───────────────────────────────────────────────────┘
```

> O deploy **só acontece** se todos os testes passarem, e apenas em push direto para a `main` — nunca em Pull Requests.

### Secrets necessários no GitHub

Para que o deploy funcione, configure estes secrets nas configurações do repositório:

| Secret | Descrição |
|---|---|
| `VERCEL_TOKEN` | Token de autenticação da Vercel |
| `VERCEL_ORG_ID` | ID da organização na Vercel |
| `VERCEL_PROJECT_ID` | ID do projeto na Vercel |

---

## Deploy

A API está hospedada na **Vercel** e o deploy é feito automaticamente via GitHub Actions após cada push bem-sucedido na branch `main`.

### Como funciona

1. Você faz um commit e push para a branch `main`
2. O GitHub Actions executa todos os testes
3. Se os testes passarem, o deploy é feito automaticamente para a Vercel
4. A Vercel serve a API em produção usando o banco de dados **Neon** (PostgreSQL gerenciado em nuvem)

### Ambientes

| Ambiente | Banco de dados | Como acessar |
|---|---|---|
| **Local** | PostgreSQL via Docker | `http://localhost:8080` |
| **Produção** | Neon (PostgreSQL na nuvem) | URL da Vercel |

---

## Autor

**Marcus Silva** — [@silvamaarcus](https://github.com/silvamaarcus)
