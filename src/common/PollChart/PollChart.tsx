import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { ChartBar, ChartPie } from 'phosphor-react';
import type { Poll } from '../../types/poll';
import styles from './PollChart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface PollChartProps {
  poll: Poll;
  defaultType?: 'bar' | 'doughnut';
}

export const PollChart: React.FC<PollChartProps> = ({ poll, defaultType = 'doughnut' }) => {
  const [chartType, setChartType] = useState<'bar' | 'doughnut'>(defaultType);
  if (poll.status !== 'CLOSED') {
    return null;
  }

  const optionsWithVotes = poll.options.filter(option => (option.votesCount || 0) > 0);
  const labels = optionsWithVotes.map(option => option.text);
  const voteCounts = optionsWithVotes.map(option => option.votesCount || 0);
  const totalVotes = poll.totalVotes || voteCounts.reduce((sum, count) => sum + count, 0);

  // Cores vibrantes para o gráfico
  const backgroundColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#FF6384',
    '#C9CBCF',
    '#4BC0C0',
    '#36A2EB'
  ];

  const borderColors = backgroundColors.map(color => color.replace('1)', '1)'));

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Votos',
        data: voteCounts,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderColor: borderColors.slice(0, labels.length),
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw;
            const percentage = totalVotes > 0 ? ((value / totalVotes) * 100).toFixed(1) : '0';
            return `${context.label}: ${value} votos (${percentage}%)`;
          },
        },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (totalVotes === 0) {
    return (
      <div className={styles.noVotes}>
        <p>Nenhum voto foi registrado nesta votação.</p>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h3>Resultados da Votação</h3>
        <div className={styles.chartControls}>
          <button
            className={`${styles.chartButton} ${chartType === 'doughnut' ? styles.active : ''}`}
            onClick={() => setChartType('doughnut')}
            title="Gráfico de Rosca"
          >
            <ChartPie size={16} />
          </button>
          <button
            className={`${styles.chartButton} ${chartType === 'bar' ? styles.active : ''}`}
            onClick={() => setChartType('bar')}
            title="Gráfico de Barras"
          >
            <ChartBar size={16} />
          </button>
        </div>
        <p className={styles.totalVotes}>
          Total de votos: <strong>{totalVotes}</strong>
        </p>
      </div>

      <div className={styles.chartWrapper}>
        {chartType === 'doughnut' ? (
          <Doughnut data={chartData} options={chartOptions} />
        ) : (
          <Bar data={chartData} options={barOptions} />
        )}
      </div>

      <div className={styles.statisticsGrid}>
        {optionsWithVotes.map((option, index) => {
          const percentage = totalVotes > 0 ? ((option.votesCount || 0) / totalVotes) * 100 : 0;
          return (
            <div key={option.id} className={styles.statItem}>
              <div
                className={styles.statColor}
                style={{ backgroundColor: backgroundColors[index] }}
              />
              <div className={styles.statContent}>
                <span className={styles.statLabel}>{option.text}</span>
                <span className={styles.statValue}>
                  {option.votesCount || 0} votos ({percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
