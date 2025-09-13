import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import styles from "./App.module.css";
import { Text } from "./common";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div>
          <Text variant="title" className={styles.title}>
            Plataforma de Votação em Tempo Real
          </Text>
          <Text as="p" variant="body" className={styles.subtitle}>
            Aplicação para criação e participação em enquetes com resultados
            instantâneos.
          </Text>

          <div className={styles.authors}>
            <div className={styles.author}>
              Adson Ferreira dos Santos —{" "}
              <a href="https://github.com/AdsonFS" target="_blank">
                github.com/AdsonFS
              </a>
            </div>
            <div className={styles.author}>
              Guilherme Fernandes Machado Borges —{" "}
              <a href="https://github.com/guilherme-fmb" target="_blank">
                github.com/guilherme-fmb
              </a>
            </div>
            <div className={styles.author}>
              João Victor Godoy da Silva —{" "}
              <a href="https://github.com/joaovictorgs" target="_blank">
                github.com/joaovictorgs
              </a>
            </div>
            <div className={styles.author}>
              Matheus Dionisio Teixeira Andrade —{" "}
              <a href="https://github.com/MatheusAndrade23" target="_blank">
                github.com/MatheusAndrade23
              </a>
            </div>
          </div>
        </div>

        <div className={styles.logos}>
          <img src={viteLogo} className={styles.logo} alt="Vite logo" />
          <img src={reactLogo} className={styles.logo} alt="React logo" />
        </div>
      </header>

      <main>
        <section className={`${styles.card} ${styles.section}`}>
          <Text as="h2" variant="subtitle">
            VISÃO GERAL
          </Text>
          <Text as="p" variant="body">
            A Plataforma de Votação em Tempo Real é uma aplicação web
            desenvolvida em TypeScript que permite a criação e participação em
            enquetes de forma dinâmica, com resultados atualizados
            instantaneamente.
          </Text>
        </section>

        <section className={`${styles.card} ${styles.section}`}>
          <Text as="h2" variant="subtitle">
            OBJETIVOS
          </Text>
          <ol className={styles.specList}>
            <li>Permitir que qualquer usuário crie enquetes personalizadas.</li>
            <li>
              Possibilitar votos únicos por usuário, prevenindo manipulação de
              resultados.
            </li>
            <li>
              Exibir resultados em tempo real através de gráficos interativos.
            </li>
            <li>
              Garantir a integridade das votações com validação de identidade e
              registros no banco de dados.
            </li>
          </ol>
        </section>

        <section className={`${styles.card} ${styles.section}`}>
          <Text as="h2" variant="subtitle">
            ESPECIFICAÇÕES
          </Text>
          <ul className={styles.specList}>
            <li>Front-end: React (TypeScript)</li>
            <li>Back-end: Node.js (TypeScript)</li>
            <li>Banco de Dados: PostgreSQL</li>
            <li>Comunicação em Tempo Real: Socket.IO (WebSockets)</li>
            <li>Testes Unitários: Jest</li>
          </ul>
        </section>

        <div className={styles.card}>
          <div className={styles.controls}>
            <button className="btn" onClick={() => setCount((c) => c + 1)}>
              Contador: <span className={styles.counter}>{count}</span>
            </button>
            <button className="btn secondary" onClick={() => setCount(0)}>
              Reset
            </button>
          </div>
        </div>

        {/* Demo renderizações das variantes e cores */}
        <section className={`${styles.card} ${styles.section}`}>
          <Text as="h2" variant="subtitle">
            DEMO: Variantes e Cores
          </Text>
          <div style={{ display: "grid", gap: 8 }}>
            <Text variant="title" as="div" color="#111827">
              Title (default)
            </Text>
            <Text variant="subtitle" as="div" color="#374151">
              Subtitle (muted)
            </Text>
            <Text variant="body" as="div" color="#111827">
              Body (black)
            </Text>
            <Text variant="small" as="div" color="#6b7280">
              Small (muted)
            </Text>
            <Text variant="success" as="div" color="#16a34a">
              Success (green)
            </Text>
            <Text variant="error" as="div" color="#dc2626">
              Error (red)
            </Text>
            <Text variant="form" as="div" color="#0ea5e9">
              Form (accent)
            </Text>
            <Text variant="placeholder" as="div" color="#9ca3af">
              Placeholder (gray)
            </Text>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div>Informações do projeto e referências.</div>
      </footer>
    </div>
  );
}

export default App;
