import React from 'react';
import { useNavigate } from 'react-router-dom';

export const CreatePollPage: React.FC = () => {
  const navigate = useNavigate();

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
      <h1>Criar Votação</h1>
      <p>Formulário para criar nova votação</p>
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

export default CreatePollPage;
