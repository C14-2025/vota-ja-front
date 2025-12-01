# PollChart Component

O componente `PollChart` é usado para exibir gráficos dos resultados de votações encerradas.

## Características

- **Exibição condicional**: Aparece apenas para votações com `status === 'CLOSED'`
- **Tipos de gráfico**: Suporta gráfico de rosca (doughnut) e barras
- **Interativo**: Botões para alternar entre tipos de gráfico
- **Estatísticas detalhadas**: Mostra percentuais e contagem de votos
- **Responsivo**: Adapta-se a diferentes tamanhos de tela

## Uso

```tsx
import { PollChart } from '../../common';

// Em uma página de detalhes da votação
{poll.status === 'CLOSED' && <PollChart poll={poll} />}
```

## Props

```tsx
interface PollChartProps {
  poll: Poll;                           // Dados da votação
  defaultType?: 'bar' | 'doughnut';     // Tipo padrão do gráfico
}
```

## Dados exibidos

Quando uma votação é encerrada, o gráfico mostra:

### 1. **Cabeçalho**
- Título "Resultados da Votação"
- Botões para alternar entre gráfico de rosca e barras
- Total de votos recebidos

### 2. **Gráfico Visual**
- **Gráfico de Rosca (padrão)**: Ideal para visualizar proporções
- **Gráfico de Barras**: Melhor para comparar valores absolutos
- Cores distintas para cada opção
- Tooltips com informações detalhadas

### 3. **Estatísticas Detalhadas**
Para cada opção que recebeu votos:
- Nome da opção
- Número absoluto de votos
- Porcentagem do total
- Indicador visual de cor correspondente ao gráfico

## Comportamentos Especiais

### Votações sem votos
Se a votação não recebeu nenhum voto, exibe uma mensagem:
```
"Nenhum voto foi registrado nesta votação."
```

### Filtros automáticos
- Opções com 0 votos são filtradas do gráfico visual
- Mas ainda aparecem nas estatísticas se necessário
- Cálculos de porcentagem são baseados no total real de votos

## Exemplo de dados recebidos

```json
{
  "id": "123",
  "title": "Melhor linguagem de programação?",
  "status": "CLOSED",
  "totalVotes": 150,
  "options": [
    {
      "id": "1",
      "text": "JavaScript",
      "votesCount": 75
    },
    {
      "id": "2", 
      "text": "Python",
      "votesCount": 45
    },
    {
      "id": "3",
      "text": "TypeScript", 
      "votesCount": 30
    }
  ]
}
```

## Integração com Socket.IO

O gráfico é atualizado automaticamente quando:
1. Uma votação é encerrada via socket
2. O evento `pollUpdated` é recebido
3. Os dados são recarregados via API
4. O componente re-renderiza com os novos dados

## Tecnologias utilizadas

- **Chart.js**: Biblioteca de gráficos
- **react-chartjs-2**: Wrapper React para Chart.js  
- **Phosphor React**: Ícones dos botões
- **CSS Modules**: Estilização isolada
