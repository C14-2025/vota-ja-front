import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import styles from "./App.module.css";
import { Text, IconButton, AppToast, appToast, Input, Button } from "./common";
import {
  ArrowUp,
  Heart,
  Gear,
  User,
  Lock,
  PaperPlaneTilt,
  Plus,
  Trash,
} from "phosphor-react";

function App() {
  const [count, setCount] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

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

        <section className={`${styles.card} ${styles.section}`}>
          <Text as="h2" variant="subtitle">
            DEMO: Input Component
          </Text>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxWidth: 400,
            }}
          >
            <Input
              label="Email"
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              helperText="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />

            <Input
              label="Nome de usuário"
              type="text"
              placeholder="Digite seu nome"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />

            <Input
              label="Email com erro"
              type="email"
              placeholder="exemplo@email.com"
              error="Email inválido"
              defaultValue="email-invalido"
              fullWidth
            />

            <Input
              label="Campo com sucesso"
              type="text"
              variant="success"
              defaultValue="Validado com sucesso!"
              helperText="Este campo está correto"
              fullWidth
            />

            <Input
              label="Campo desabilitado"
              type="text"
              placeholder="Campo desabilitado"
              disabled
              fullWidth
            />
          </div>
        </section>

        <section className={`${styles.card} ${styles.section}`}>
          <Text as="h2" variant="subtitle">
            DEMO: Button Component
          </Text>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Button
                variant="primary"
                onClick={() => appToast.info("Primary button clicked")}
              >
                Primary
              </Button>
              <Button
                variant="secondary"
                onClick={() => appToast.info("Secondary button clicked")}
              >
                Secondary
              </Button>
              <Button
                variant="ghost"
                onClick={() => appToast.info("Ghost button clicked")}
              >
                Ghost
              </Button>
              <Button
                variant="outline"
                onClick={() => appToast.info("Outline button clicked")}
              >
                Outline
              </Button>
              <Button
                variant="success"
                onClick={() => appToast.success("Success!")}
              >
                Success
              </Button>
              <Button
                variant="danger"
                onClick={() => appToast.error("Danger!")}
              >
                Danger
              </Button>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Button size="small">Small</Button>
              <Button size="medium">Medium</Button>
              <Button size="large">Large</Button>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Button leftIcon={User}>Com ícone esquerdo</Button>
              <Button rightIcon={PaperPlaneTilt}>Com ícone direito</Button>
              <Button leftIcon={Plus} rightIcon={PaperPlaneTilt}>
                Ambos os ícones
              </Button>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexDirection: "column",
                maxWidth: 300,
              }}
            >
              <Button fullWidth>Largura total</Button>
              <Button
                fullWidth
                variant="success"
                loading={loading}
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    appToast.success("Ação completada!");
                  }, 2000);
                }}
              >
                {loading ? "Carregando..." : "Clique para carregar"}
              </Button>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <Button disabled>Desabilitado</Button>
              <Button variant="outline" disabled>
                Outline Desabilitado
              </Button>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <Button
                variant="primary"
                leftIcon={Lock}
                onClick={() => appToast.info("Login simulado")}
              >
                Login
              </Button>
              <Button
                variant="danger"
                leftIcon={Trash}
                size="small"
                onClick={() => appToast.error("Item deletado")}
              >
                Deletar
              </Button>
            </div>
          </div>
        </section>

        <section className={`${styles.card} ${styles.section}`}>
          <Text as="h2" variant="subtitle">
            DEMO: Formulário Completo
          </Text>
          <form
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxWidth: 400,
            }}
            onSubmit={(e) => {
              e.preventDefault();
              appToast.success("Formulário enviado com sucesso!");
            }}
          >
            <Input
              label="Email"
              type="email"
              placeholder="seu-email@exemplo.com"
              required
              fullWidth
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              helperText="Deve conter pelo menos 8 caracteres"
              required
              fullWidth
            />

            <div style={{ display: "flex", gap: 8 }}>
              <Button type="submit" variant="primary" leftIcon={PaperPlaneTilt}>
                Enviar
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => appToast.info("Cancelado")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </section>

        <section className={`${styles.card} ${styles.section}`}>
          <Text as="h2" variant="subtitle">
            DEMO: IconButton e Text
          </Text>
          <div style={{ marginTop: 12 }}>
            <Text as="h3" variant="small">
              IconButton - exemplos
            </Text>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <IconButton
                Icon={ArrowUp}
                size={16}
                aria-label="up"
                onClick={() => appToast.info("Up clicked")}
              />
              <IconButton
                Icon={Heart}
                size={24}
                color="#e11d48"
                aria-label="like"
                onClick={() => appToast.success("Liked")}
              />
              <IconButton
                Icon={Gear}
                size={32}
                color="#0ea5e9"
                aria-label="settings"
                onClick={() => appToast.warn("Settings changed")}
              />
              <IconButton
                src={reactLogo}
                size={28}
                aria-label="react"
                onClick={() => appToast.info("React logo clicked")}
              />
              <IconButton
                Icon={ArrowUp}
                size={24}
                disabled
                aria-label="disabled"
                onClick={() => appToast.error("Disabled button clicked")}
              />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <IconButton
                Icon={Heart}
                size={18}
                color="#f97316"
                aria-label="heart-small"
                onClick={() => appToast.success("Small heart")}
              />
              <IconButton
                Icon={Heart}
                size={36}
                color="#10b981"
                aria-label="heart-large"
                onClick={() => appToast.success("Large heart")}
              />
            </div>
          </div>
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
      <AppToast />
    </div>
  );
}

export default App;
