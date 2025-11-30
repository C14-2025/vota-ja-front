import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../../contexts';
import { Input, Button } from '../../../common';
import { registerSchema } from '../../../utils/validation';
import type { RegisterFormData } from '../../../utils/validation';
import styles from '../AuthPage.module.css';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    console.log('Register:', {
      name: data.name,
      email: data.email,
      password: data.password,
    });

    setTimeout(() => {
      login();
      navigate('/home');
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.brand}>Vota Já</h1>
          <h2 className={styles.title}>CADASTRO</h2>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="name"
            type="text"
            label="Nome"
            placeholder="Seu nome completo"
            error={errors.name?.message}
            fullWidth
            {...register('name')}
          />

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
            placeholder="Mínimo 6 caracteres"
            error={errors.password?.message}
            fullWidth
            {...register('password')}
          />

          <Input
            id="confirmPassword"
            type="password"
            label="Confirme sua senha"
            placeholder="Digite a senha novamente"
            error={errors.confirmPassword?.message}
            fullWidth
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
          >
            Cadastrar
          </Button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Já tem uma conta?{' '}
            <span
              className={styles.footerLink}
              onClick={() => navigate('/login')}
            >
              Faça login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
