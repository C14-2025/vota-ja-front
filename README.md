# Plataforma de Votação em Tempo Real — Frontend

Breve frontend em React + TypeScript para a Plataforma de Votação em Tempo Real.

Principais tecnologias: React, TypeScript, Vite, Jest.

## Como usar

Pré-requisitos:

- Node.js (>= 16) e npm

Instalar dependências:

```powershell
npm install
```

Rodar em desenvolvimento:

```powershell
npm run dev
```

Build de produção:

```powershell
npm run build
```

Executar testes com coverage:

```powershell
npm test -- --coverage
```

## Scripts úteis

- npm run dev — inicia o servidor de desenvolvimento (Vite)
- npm run build — gera bundle para produção
- npm test — executa testes (Jest)

## Estrutura resumida

- src/ — código-fonte
  - common/ — componentes reutilizáveis
  - modules/ — recursos por domínio/feature
  - lib/ — utilitários e cliente API
  - services/ — chamadas à API
  - types/ — definições TypeScript

## Contribuição

1. Crie uma branch: feat/minha-feature
2. Faça commits pequenos e com mensagem descritiva
3. Abra Pull Request e solicite revisão

## Arquivos importantes

- `src/config.ts` — configurações do frontend
- `src/env.ts` — variáveis de ambiente (validação)
- `tests/` — testes unitários
