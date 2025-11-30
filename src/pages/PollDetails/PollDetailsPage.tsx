import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  User,
  CalendarBlank,
  ChartBar,
  ListChecks,
  Check,
  LockKey,
  Globe,
  X,
  Lock,
} from 'phosphor-react';
import { Button } from '../../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { getPollById, createVote, deleteVote, closePoll } from '../../services';
import type { Poll } from '../../types/poll';
import { parseApiError } from '../../types/error';
import styles from './PollDetailsPage.module.css';

export const PollDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, userId } = useAuth();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [closing, setClosing] = useState(false);
  const [userVotedOptionId, setUserVotedOptionId] = useState<string | null>(
    null
  );

  const loadPoll = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getPollById(id);
      setPoll(data);

      setUserVotedOptionId(data.votedOption || null);
    } catch (error) {
      const message = parseApiError(error);
      toast.error(message);
      console.error('Error loading poll:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPoll();
  }, [loadPoll]);

  const handleVote = async () => {
    if (!selectedOption || !id) return;

    try {
      setVoting(true);
      await createVote({
        pollId: id,
        optionId: selectedOption,
      });

      toast.success('Voto registrado com sucesso!');
      setUserVotedOptionId(selectedOption);
      setSelectedOption(null);

      await loadPoll();
    } catch (error) {
      const message = parseApiError(error);
      toast.error(message);
      console.error('Error voting:', error);
    } finally {
      setVoting(false);
    }
  };

  const handleCancelVote = async () => {
    if (!id) return;

    try {
      setCanceling(true);
      await deleteVote(id);

      toast.success('Voto cancelado com sucesso!');
      setUserVotedOptionId(null);

      await loadPoll();
    } catch (error) {
      const message = parseApiError(error);
      toast.error(message);
      console.error('Error canceling vote:', error);
    } finally {
      setCanceling(false);
    }
  };

  const handleClosePoll = async () => {
    if (!id) return;

    try {
      setClosing(true);
      await closePoll(id);

      toast.success('Votação encerrada com sucesso!');
      await loadPoll();
    } catch (error) {
      const message = parseApiError(error);
      toast.error(message);
      console.error('Error closing poll:', error);
    } finally {
      setClosing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTotalVotes = () => {
    if (!poll) return 0;
    return poll.totalVotes || 0;
  };

  const getVotePercentage = (optionVotes: number) => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return Math.round((optionVotes / total) * 100);
  };

  if (poll) {
    console.log('Poll data:', {
      totalVotes: poll.totalVotes,
      options: poll.options.map((opt) => ({
        text: opt.text,
        votesCount: opt.votesCount,
        raw: opt,
      })),
    });
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Button
            variant="secondary"
            size="small"
            onClick={() => navigate('/home')}
          >
            <ArrowLeft size={16} weight="bold" />
            Voltar
          </Button>
        </div>
        <div className={styles.content}>
          <div className={styles.loading}>Carregando votação...</div>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Button
            variant="secondary"
            size="small"
            onClick={() => navigate('/home')}
          >
            <ArrowLeft size={16} weight="bold" />
            Voltar
          </Button>
        </div>
        <div className={styles.content}>
          <div className={styles.loading}>Votação não encontrada</div>
        </div>
      </div>
    );
  }

  const totalVotes = getTotalVotes();
  const hasVoted = !!userVotedOptionId;
  const isOwner =
    userId && poll.creator && String(userId) === String(poll.creator.id);
  const canVote = isAuthenticated && !hasVoted && poll.status === 'OPEN';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          variant="secondary"
          size="small"
          onClick={() => navigate('/home')}
        >
          <ArrowLeft size={16} weight="bold" />
          Voltar
        </Button>
      </div>

      <div className={styles.content}>
        <div className={styles.pollHeader}>
          <div className={styles.titleSection}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{poll.title}</h1>
              <div className={styles.titleRight}>
                {isOwner && poll.status === 'OPEN' && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={handleClosePoll}
                    disabled={closing}
                  >
                    {closing ? (
                      'Encerrando...'
                    ) : (
                      <>
                        <Lock size={16} weight="bold" />
                        Encerrar
                      </>
                    )}
                  </Button>
                )}
                <div className={styles.badges}>
                  <span
                    className={`${styles.badge} ${poll.type === 'public' ? styles.public : styles.private}`}
                  >
                    {poll.type === 'public' ? (
                      <>
                        <Globe size={12} weight="fill" />
                        Pública
                      </>
                    ) : (
                      <>
                        <LockKey size={12} weight="fill" />
                        Privada
                      </>
                    )}
                  </span>
                  {poll.status === 'CLOSED' && (
                    <span className={`${styles.badge} ${styles.closed}`}>
                      <Lock size={12} weight="fill" />
                      Encerrada
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {poll.description && (
            <p className={styles.description}>{poll.description}</p>
          )}

          <div className={styles.metadata}>
            <div className={styles.metaItem}>
              <User size={16} weight="bold" />
              <span>
                Criado por <strong>{poll.creator.name}</strong>
              </span>
            </div>
            <div className={styles.metaItem}>
              <CalendarBlank size={16} weight="bold" />
              <span>{formatDate(poll.createdAt)}</span>
            </div>
            <div className={styles.metaItem}>
              <ChartBar size={16} weight="bold" />
              <span>
                <strong>{totalVotes}</strong>{' '}
                {totalVotes === 1 ? 'voto' : 'votos'}
              </span>
            </div>
            <div className={styles.metaItem}>
              <ListChecks size={16} weight="bold" />
              <span>
                <strong>{poll.options.length}</strong>{' '}
                {poll.options.length === 1 ? 'opção' : 'opções'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.optionsSection}>
          <h2 className={styles.optionsTitle}>Opções de Voto</h2>
          <div className={styles.optionsList}>
            {poll.options.map((option) => {
              const votes = option.votesCount || 0;
              const percentage = getVotePercentage(votes);
              const isSelected = selectedOption === option.id;
              const isUserVoted = hasVoted && userVotedOptionId === option.id;

              return (
                <div
                  key={option.id}
                  className={`${styles.optionCard} ${
                    canVote ? styles.interactive : ''
                  } ${isSelected ? styles.selected : ''} ${
                    hasVoted || !isAuthenticated ? styles.voted : ''
                  } ${isUserVoted ? styles.userVoted : ''}`}
                  onClick={() => canVote && setSelectedOption(option.id)}
                >
                  <div className={styles.optionContent}>
                    <div className={styles.optionHeader}>
                      <span className={styles.optionText}>{option.text}</span>
                      {isSelected && (
                        <Check
                          size={24}
                          weight="bold"
                          className={styles.checkIcon}
                        />
                      )}
                      {isUserVoted && (
                        <Check
                          size={24}
                          weight="bold"
                          className={styles.userVotedIcon}
                        />
                      )}
                    </div>
                    <div className={styles.optionStats}>
                      <div className={styles.progressBarContainer}>
                        <div
                          className={styles.progressBar}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className={styles.statsText}>
                        <span className={styles.percentage}>{percentage}%</span>
                        <span className={styles.votes}>
                          {votes} {votes === 1 ? 'voto' : 'votos'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {poll.status === 'CLOSED' && (
          <div className={styles.closedMessage}>
            <Lock size={24} weight="bold" />
            <p>Esta votação foi encerrada e não aceita mais votos</p>
          </div>
        )}

        {poll.status === 'OPEN' && !isAuthenticated && (
          <div className={styles.loginPrompt}>
            <p>Faça login para votar nesta votação</p>
            <Button variant="primary" onClick={() => navigate('/login')}>
              Fazer Login
            </Button>
          </div>
        )}

        {poll.status === 'OPEN' && isAuthenticated && (
          <div className={styles.actions}>
            {hasVoted ? (
              <Button
                variant="secondary"
                onClick={handleCancelVote}
                disabled={canceling}
                fullWidth
              >
                {canceling ? (
                  'Cancelando...'
                ) : (
                  <>
                    <X size={16} weight="bold" />
                    Cancelar Voto
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleVote}
                disabled={!selectedOption || voting}
                fullWidth
              >
                {voting ? 'Registrando voto...' : 'Confirmar Voto'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
