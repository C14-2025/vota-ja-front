import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../common/Button';
import { ArrowLeft } from 'phosphor-react';

export const PollDetailsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem' }}>
      <Button
        variant="secondary"
        size="small"
        onClick={() => navigate('/home')}
      >
        <ArrowLeft size={16} weight="bold" />
        Voltar
      </Button>

      <div style={{ marginTop: '2rem' }}>
        <h1>Detalhes da Votação</h1>
        <p>Esta página será implementada em breve.</p>
      </div>
    </div>
  );
};
