import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    login();
    navigate('/home');
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
      <h1>Login</h1>
      <p>Faça login para acessar o sistema</p>
      <button
        onClick={handleLogin}
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
        Entrar
      </button>
    </div>
  );
};

export default LoginPage;
