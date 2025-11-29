import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
      <h1>Home</h1>
      <p>Página inicial</p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => navigate('/polls/create')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            borderRadius: '5px',
            border: 'none',
            background: '#10b981',
            color: 'white',
          }}
        >
          Criar Votação
        </button>
        <button
          onClick={() => navigate('/polls/123')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            borderRadius: '5px',
            border: 'none',
            background: '#3b82f6',
            color: 'white',
          }}
        >
          Ver Votação
        </button>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            borderRadius: '5px',
            border: 'none',
            background: '#ef4444',
            color: 'white',
          }}
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default HomePage;
