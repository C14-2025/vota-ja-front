import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useAuth } from '../../../contexts';
import { Input, Button } from '../../../common';
import { loginSchema } from '../../../utils/validation';
import type { LoginFormData } from '../../../utils/validation';
import { login as loginUser } from '../../../services/authService';
import { parseApiError } from '../../../types/error';
import styles from '../AuthPage.module.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });

      login(response.accessToken);
      toast.success('Login realizado com sucesso!');
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(parseApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.brand}>Vota Já</h1>
          <h2 className={styles.title}>LOGIN</h2>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="seu@email.com"
            error={errors.email?.message}
            fullWidth
            {...register('email')}
          />

          <Input
            id="password"
            type="password"
            label="Senha"
            placeholder="••••••••"
            error={errors.password?.message}
            fullWidth
            {...register('password')}
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
          >
            Entrar
          </Button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Não tem uma conta?{' '}
            <span
              className={styles.footerLink}
              onClick={() => navigate('/register')}
            >
              Cadastre-se
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
