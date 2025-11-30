import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { getPolls } from '../../services/pollService';
import type { Poll } from '../../types/poll';
import { Button } from '../../common/Button';
import { ChartBar, CheckSquare, Calendar, User } from 'phosphor-react';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const itemsPerPage = 10;

  const loadPolls = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPolls(currentPage, itemsPerPage);

      let filteredPolls = response.items;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredPolls = response.items.filter(
          (poll) =>
            poll.title.toLowerCase().includes(query) ||
            poll.description.toLowerCase().includes(query)
        );
      }

      setPolls(filteredPolls);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      setError('Erro ao carregar votações. Tente novamente.');
      console.error('Error loading polls:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchQuery]);

  useEffect(() => {
    loadPolls();
  }, [loadPolls]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePollClick = (pollId: string) => {
    navigate(`/polls/${pollId}`);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>HOME (Listagem de Votações)</div>
        <div className={styles.headerActions}>
          <Button variant="secondary" size="small" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Buscar votações..."
            className={styles.searchInput}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button variant="primary" onClick={() => navigate('/polls/create')}>
            Nova Votação
          </Button>
        </div>

        {loading && (
          <div className={styles.loading}>
            <p>Carregando votações...</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <Button variant="primary" size="small" onClick={loadPolls}>
              Tentar Novamente
            </Button>
          </div>
        )}

        {!loading && !error && polls.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <ChartBar size={48} weight="thin" />
            </div>
            <div className={styles.emptyText}>Nenhuma votação encontrada</div>
            <div className={styles.emptySubtext}>
              {searchQuery
                ? 'Tente buscar por outros termos'
                : 'Crie sua primeira votação para começar'}
            </div>
            {!searchQuery && (
              <Button
                variant="primary"
                onClick={() => navigate('/polls/create')}
              >
                Criar Votação
              </Button>
            )}
          </div>
        )}

        {!loading && !error && polls.length > 0 && (
          <>
            <div className={styles.pollsList}>
              {polls.map((poll) => (
                <div
                  key={poll.id}
                  className={styles.pollCard}
                  onClick={() => handlePollClick(poll.id)}
                >
                  <div className={styles.pollHeader}>
                    <h3 className={styles.pollTitle}>{poll.title}</h3>
                    <span className={`${styles.pollType} ${styles[poll.type]}`}>
                      {poll.type === 'public' ? 'Pública' : 'Privada'}
                    </span>
                  </div>

                  <p className={styles.pollDescription}>{poll.description}</p>

                  <div className={styles.pollFooter}>
                    <div className={styles.pollMeta}>
                      <span>
                        <ChartBar size={16} /> {poll.totalVotes || 0} votos
                      </span>
                      <span>
                        <CheckSquare size={16} /> {poll.options.length} opções
                      </span>
                      <span>
                        <Calendar size={16} /> {formatDate(poll.createdAt)}
                      </span>
                      <span>
                        <User size={16} /> {poll.creator.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageButton}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>

                <span className={styles.pageInfo}>
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  className={styles.pageButton}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
