import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts';
import { getPolls, closePoll } from '../../services/pollService';
import { parseApiError } from '../../types/error';
import type { Poll } from '../../types/poll';
import { Button } from '../../common/Button';
import { ChartBar, CheckSquare, Calendar, User, Lock } from 'phosphor-react';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  const { isAuthenticated, userId, logout } = useAuth();
  const navigate = useNavigate();

  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [closingPollId, setClosingPollId] = useState<string | null>(null);

  const itemsPerPage = 10;

  const loadPolls = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPolls(currentPage, itemsPerPage, searchQuery);

      setPolls(response.items);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      console.error('Error loading polls:', err);
      toast.error(parseApiError(err));
      setPolls([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchQuery]);

  useEffect(() => {
    loadPolls();
  }, [loadPolls]);

  useEffect(() => {
    const handleFocus = () => {
      loadPolls();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
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

  const handleClosePoll = async (pollId: string, event: React.MouseEvent) => {
    event.stopPropagation();

    try {
      setClosingPollId(pollId);
      await closePoll(pollId);
      toast.success('Votação encerrada com sucesso!');
      await loadPolls();
    } catch (error) {
      const message = parseApiError(error);
      toast.error(message);
      console.error('Error closing poll:', error);
    } finally {
      setClosingPollId(null);
    }
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
          {isAuthenticated ? (
            <Button variant="secondary" size="small" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                size="small"
                onClick={() => navigate('/login')}
              >
                Entrar
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={() => navigate('/register')}
              >
                Cadastrar
              </Button>
            </>
          )}
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
          {isAuthenticated && (
            <Button variant="primary" onClick={() => navigate('/polls/create')}>
              Nova Votação
            </Button>
          )}
        </div>

        {loading && (
          <div className={styles.loading}>
            <p>Carregando votações...</p>
          </div>
        )}

        {!loading && polls.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <ChartBar size={48} weight="thin" />
            </div>
            <div className={styles.emptyText}>Nenhuma votação encontrada</div>
            <div className={styles.emptySubtext}>
              {searchQuery
                ? 'Tente buscar por outros termos'
                : isAuthenticated
                  ? 'Crie sua primeira votação para começar'
                  : 'Faça login para criar votações'}
            </div>
            {!searchQuery && isAuthenticated && (
              <Button
                variant="primary"
                onClick={() => navigate('/polls/create')}
              >
                Criar Votação
              </Button>
            )}
            {!searchQuery && !isAuthenticated && (
              <Button variant="primary" onClick={() => navigate('/login')}>
                Fazer Login
              </Button>
            )}
          </div>
        )}

        {!loading && polls.length > 0 && (
          <>
            <div className={styles.pollsList}>
              {polls.map((poll) => (
                <div
                  key={poll.id}
                  className={`${styles.pollCard} ${poll.status === 'CLOSED' ? styles.closedPoll : ''}`}
                  onClick={() => handlePollClick(poll.id)}
                >
                  <div className={styles.pollHeader}>
                    <div className={styles.pollTitleRow}>
                      <h3 className={styles.pollTitle}>{poll.title}</h3>
                      <div className={styles.pollHeaderRight}>
                        {userId &&
                          poll.creator &&
                          String(userId) === String(poll.creator.id) &&
                          poll.status === 'OPEN' && (
                            <Button
                              variant="secondary"
                              size="small"
                              onClick={(e) => handleClosePoll(poll.id, e)}
                              disabled={closingPollId === poll.id}
                            >
                              {closingPollId === poll.id ? (
                                'Encerrando...'
                              ) : (
                                <>
                                  <Lock size={14} weight="bold" />
                                  Encerrar
                                </>
                              )}
                            </Button>
                          )}
                        <div className={styles.pollBadges}>
                          <span
                            className={`${styles.pollType} ${styles[poll.type]}`}
                          >
                            {poll.type === 'public' ? 'Pública' : 'Privada'}
                          </span>
                          {poll.status === 'CLOSED' && (
                            <span
                              className={`${styles.pollType} ${styles.closed}`}
                            >
                              Encerrada
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className={styles.pollDescription}>{poll.description}</p>

                  <div className={styles.pollFooter}>
                    <div className={styles.pollMeta}>
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
