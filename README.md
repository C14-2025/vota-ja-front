# Vota Já — Plataforma de Votação em Tempo Real

## 📋 Sobre o Projeto

Sistema web de votação em tempo real desenvolvido com **React**, **TypeScript** e **Socket.IO**. Permite criar enquetes públicas e privadas, votar em opções, visualizar resultados em tempo real e gerenciar votações com autenticação segura.

### 🎯 Escopo e Funcionalidades

- ✅ **Autenticação**: Sistema completo de login e registro com JWT
- ✅ **Criação de Enquetes**: Crie votações públicas ou privadas com múltiplas opções
- ✅ **Sistema de Votação**: Vote, cancele e mude seu voto a qualquer momento
- ✅ **Atualização em Tempo Real**: Resultados atualizados instantaneamente via WebSocket
- ✅ **Gerenciamento**: Criadores podem encerrar suas votações
- ✅ **Interface Responsiva**: Design moderno e intuitivo com dark theme

## 🛠️ Tecnologias Utilizadas

### Core

- **React 19** — Biblioteca UI
- **TypeScript 5.8** — Type safety e desenvolvimento robusto
- **Vite 7** — Build tool moderna e rápida

### Principais Dependências

- **React Router DOM** — Navegação SPA
- **Socket.IO Client** — WebSocket para real-time updates
- **React Hook Form + Zod** — Validação de formulários
- **Axios** — HTTP client
- **React Toastify** — Notificações toast
- **Phosphor React** — Sistema de ícones

### Ferramentas de Desenvolvimento

- **Jest + React Testing Library** — Framework de testes (241 testes, 93.71% coverage)
- **Prettier** — Formatação de código
- **ESLint** — Linting e qualidade de código
- **npm** — Gerenciamento de dependências (28 pacotes)

## 📦 Gerenciamento de Dependências

O projeto utiliza **npm** como gerenciador de dependências. Todas as dependências são declaradas no `package.json`:

- **10 dependências de produção** (React, Socket.IO, validação, etc.)
- **18 dependências de desenvolvimento** (Jest, TypeScript, Prettier, etc.)

```bash
npm install  # Instala todas as dependências
```

## 🚀 Como Usar

### Pré-requisitos

- **Node.js** >= 16
- **npm** >= 7
- **Backend API** rodando (veja repositório [vota-ja-api](https://github.com/C14-2025/vota-ja-api))

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/C14-2025/vota-ja-front.git
cd vota-ja-front
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
# Crie um arquivo .env na raiz do projeto
VITE_API_BASE_URL=http://localhost:5000/v1
```

4. Rode em desenvolvimento:

```bash
npm run dev
# Acesse http://localhost:5173
```

### Build de Produção

```bash
npm run build      # Gera build otimizado em dist/
npm run preview    # Testa o build localmente
```

## 🧪 Testes Automatizados

O projeto possui **241 testes unitários** cobrindo **93.71%** do código, validando:

- ✅ Componentes UI (Button, Input, Text, Toast)
- ✅ Páginas (Login, Register, Home, CreatePoll, PollDetails)
- ✅ Serviços (Auth, Poll, Vote, Socket)
- ✅ Contextos (AuthContext)
- ✅ Rotas protegidas (ProtectedRoute)
- ✅ Utilitários (validação)

### Executar Testes

```bash
npm test                 # Executa todos os testes
npm run test:coverage    # Testes com relatório de cobertura
```

### Framework de Testes

- **Jest 29** — Framework principal
- **React Testing Library** — Testes de componentes React
- **jest-environment-jsdom** — Ambiente de testes DOM

### Relevância dos Testes

Todos os testes são **diretamente relevantes** ao sistema de votação:

- **authService.test.ts**: Valida login, registro, tratamento de erros de autenticação
- **pollService.test.ts**: Testa criação, listagem e encerramento de enquetes
- **voteService.test.ts**: Verifica registro e cancelamento de votos
- **socketService.test.ts**: Testa conexão WebSocket e atualização em tempo real
- **error.test.ts**: Valida tratamento de erros da API (401, 403, 404, 500)
- **validation.test.ts**: Testa validação de formulários (email, senha, campos obrigatórios)
- **Testes de componentes**: Validam UI, interações do usuário e estados de loading/erro

## 🔄 CI/CD com Jenkins

O projeto utiliza **Jenkins** (não GitHub Actions) para automação:

### Pipeline Stages

1. **Checkout** — Clona o repositório do GitHub
2. **Install Dependencies** — `npm install`
3. **Format Check** — Verifica formatação com Prettier
4. **Run Tests** — Executa 241 testes com coverage
5. **Build** — Gera bundle de produção com Vite

### Artefatos Gerados

- 📊 **Coverage Report** — Relatório HTML de cobertura de testes
- 📦 **dist/** — Build de produção pronto para deploy

### Configuração

O Jenkinsfile está na raiz do projeto e usa Node.js 20. O pipeline é executado:

- ✅ Em Pull Requests
- ✅ Em pushes para `main` e branches de feature

## 📁 Estrutura do Projeto

```
vota-ja-front/
├── src/
│   ├── common/              # Componentes reutilizáveis (Button, Input, Text, Toast)
│   ├── contexts/            # React Contexts (AuthContext)
│   ├── pages/               # Páginas da aplicação
│   │   ├── Auth/            # Login e Register
│   │   ├── CreatePoll/      # Criação de enquetes
│   │   ├── Home/            # Listagem de enquetes
│   │   └── PollDetails/     # Detalhes e votação
│   ├── routes/              # Configuração de rotas (AppRoutes, ProtectedRoute)
│   ├── services/            # Serviços de API (auth, poll, vote, socket)
│   ├── types/               # Tipos TypeScript (poll, vote, error, button, input, text)
│   ├── utils/               # Utilitários (validation, auth)
│   ├── assets/              # Imagens e recursos estáticos
│   ├── App.tsx              # Componente raiz
│   ├── main.tsx             # Entry point
│   ├── config.ts            # Configurações globais
│   ├── env.ts               # Validação de variáveis de ambiente (Zod)
│   └── paths.ts             # Rotas e endpoints da API
├── tests/                   # 241 testes unitários (19 arquivos)
│   ├── __mocks__/           # Mocks (env, socketService, react-toastify)
│   └── *.test.{ts,tsx}      # Arquivos de teste
├── coverage/                # Relatórios de cobertura (gerados após testes)
├── dist/                    # Build de produção (gerado após build)
├── Jenkinsfile              # Pipeline CI/CD
├── jest.config.cjs          # Configuração do Jest
├── package.json             # Dependências e scripts npm
├── tsconfig.json            # Configuração TypeScript
├── vite.config.ts           # Configuração Vite
└── README.md                # Este arquivo
```

## 📜 Scripts Disponíveis

```bash
npm run dev              # Servidor de desenvolvimento (localhost:5173)
npm run build            # Build de produção
npm run preview          # Preview do build
npm test                 # Executa testes
npm run test:coverage    # Testes com coverage
npm run lint             # Verifica lint
npm run format           # Formata código com Prettier
npm run format:check     # Verifica formatação
```

## 🔗 Integração com Backend

Este frontend consome a API REST do projeto **vota-ja-api**:

- **Repositório**: [C14-2025/vota-ja-api](https://github.com/C14-2025/vota-ja-api)
- **Base URL padrão**: `http://localhost:5000/v1`
- **Endpoints utilizados**:
  - `POST /auth/login` — Autenticação
  - `POST /users` — Registro
  - `GET /polls` — Listar enquetes
  - `POST /polls` — Criar enquete
  - `GET /polls/:id` — Detalhes da enquete
  - `PATCH /polls/:id/vote` — Votar
  - `DELETE /polls/:id/vote` — Cancelar voto
  - `PATCH /polls/:id/close` — Encerrar enquete
  - **WebSocket** — Atualizações em tempo real

## 🤝 Contribuição

### Workflow de Desenvolvimento

1. **Crie uma branch**: `feat/minha-feature` ou `fix/meu-bugfix`
2. **Faça commits pequenos** e com mensagens descritivas (conventional commits):
   - `feat:` nova funcionalidade
   - `fix:` correção de bug
   - `test:` adição/modificação de testes
   - `refactor:` refatoração de código
   - `chore:` mudanças em configuração/build
   - `ci:` mudanças em CI/CD
3. **Abra Pull Request** para `main`
4. **Solicite revisão** de outros membros da equipe
5. **Aguarde aprovação** e merge

### Processo de Revisão de Código

- ✅ Todo código passa por **Pull Request**
- ✅ Pelo menos **1 aprovação** necessária para merge
- ✅ **Pipeline Jenkins** deve passar (testes, lint, build)
- ✅ **Code review** por membros da equipe

## 📄 Licença

Este projeto é parte de um trabalho acadêmico.

---

**Desenvolvido com ❤️ usando React, TypeScript e Socket.IO**
