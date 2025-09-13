import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import styles from "./App.module.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Plataforma de Votação em Tempo Real</h1>
          <p className={styles.subtitle}>
            Aplicação para criação e participação em enquetes com resultados
            instantâneos.
          </p>

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
          <h2>VISÃO GERAL</h2>
          <p>
            A Plataforma de Votação em Tempo Real é uma aplicação web
            desenvolvida em TypeScript que permite a criação e participação em
            enquetes de forma dinâmica, com resultados atualizados
            instantaneamente.
          </p>
        </section>

        <section className={`${styles.card} ${styles.section}`}>
          <h2>OBJETIVOS</h2>
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
          <h2>ESPECIFICAÇÕES</h2>
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
      </main>

      <footer className={styles.footer}>
        <div>Informações do projeto e referências.</div>
      </footer>
    </div>
  );
}

export default App;
