import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import * as apiService from '../../services/api';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { Text } from '../../common/Text';
import styles from './CreatePollPage.module.css';

const createPollSchema = z
  .object({
    title: z.string().min(1, 'Título é obrigatório'),
    description: z.string().min(1, 'Descrição é obrigatória'),
    type: z.enum(['public', 'private']),
    option1: z.string().min(1, 'Opção 1 é obrigatória'),
    option2: z.string().min(1, 'Opção 2 é obrigatória'),
    option3: z.string().optional(),
    option4: z.string().optional(),
  })
  .refine(
    (data) => {
      const options = [
        data.option1,
        data.option2,
        data.option3,
        data.option4,
      ].filter((opt) => opt && opt.trim().length > 0);
      return options.length >= 2;
    },
    {
      message: 'Deve ter no mínimo 2 opções',
      path: ['option2'],
    }
  );

type CreatePollFormData = z.infer<typeof createPollSchema>;

export function CreatePollPage() {
  const navigate = useNavigate();
  useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('authToken');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePollFormData>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      type: 'public',
    },
  });

  const onSubmit = async (data: CreatePollFormData) => {
    if (!token) {
      toast.error('Você precisa estar logado para criar uma votação');
      navigate('/login');
      return;
    }

    setIsLoading(true);

    try {
      const options = [
        data.option1,
        data.option2,
        data.option3,
        data.option4,
      ].filter((opt): opt is string => !!opt && opt.trim().length > 0);

      const response = await apiService.createPoll(
        {
          title: data.title,
          description: data.description,
          type: data.type,
          options,
        },
        token
      );

      toast.success('Votação criada com sucesso!');
      navigate(`/polls/${response.id}`);
    } catch (error) {
      console.error('Error creating poll:', error);
      toast.error(
        error instanceof Error ? error.message : 'Erro ao criar votação'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.header}>
          <h1>Criar Votação</h1>
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
            type="button"
          >
            Voltar
          </Button>
        </div>
        <div className={styles.formContent}>
          <div className={styles.topSection}>
            <div className={styles.field}>
              <label htmlFor="title" className={styles.label}>
                Título
              </label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Digite o título da votação"
                error={errors.title?.message}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Tipo</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    value="public"
                    {...register('type')}
                    className={styles.radio}
                  />
                  <span>Pública</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    value="private"
                    {...register('type')}
                    className={styles.radio}
                  />
                  <span>Privada</span>
                </label>
              </div>
              {errors.type && (
                <Text variant="small" className={styles.error}>
                  {errors.type.message}
                </Text>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              Descrição
            </label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Descreva a votação"
              className={styles.textarea}
              rows={4}
            />
            {errors.description && (
              <Text variant="small" className={styles.error}>
                {errors.description.message}
              </Text>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Opções</label>
            <div className={styles.optionsGrid}>
              <Input
                id="option1"
                {...register('option1')}
                placeholder="Opção 1"
                error={errors.option1?.message}
              />
              <Input
                id="option2"
                {...register('option2')}
                placeholder="Opção 2"
                error={errors.option2?.message}
              />
              <Input
                id="option3"
                {...register('option3')}
                placeholder="Opção 3 (opcional)"
                error={errors.option3?.message}
              />
              <Input
                id="option4"
                {...register('option4')}
                placeholder="Opção 4 (opcional)"
                error={errors.option4?.message}
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            type="submit"
            disabled={isLoading}
            variant="primary"
            size="large"
            fullWidth
          >
            {isLoading ? 'Criando...' : 'Enviar'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreatePollPage;
