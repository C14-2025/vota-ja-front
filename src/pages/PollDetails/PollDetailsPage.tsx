import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const PollDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '20px',
      }}
    >
      <h1>Detalhes da Votação</h1>
      <p>
        ID: <strong>{id}</strong>
      </p>
      <button
        onClick={() => navigate('/home')}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          borderRadius: '5px',
          border: 'none',
          background: '#6366f1',
          color: 'white',
        }}
      >
        Voltar para Home
      </button>
    </div>
  );
};

export default PollDetailsPage;
