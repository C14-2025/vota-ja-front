import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PollChart } from '../src/common/PollChart/PollChart';
import type { Poll } from '../src/types/poll';

// Mock Chart.js
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: {},
  LinearScale: {},
  BarElement: {},
  Title: {},
  Tooltip: {},
  Legend: {},
  ArcElement: {},
}));

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Bar: ({ data }: any) => (
    <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)} />
  ),
  Doughnut: ({ data }: any) => (
    <div data-testid="doughnut-chart" data-chart-data={JSON.stringify(data)} />
  ),
}));

describe('PollChart', () => {
  const mockClosedPoll: Poll = {
    id: '1',
    title: 'Test Poll',
    description: 'Test Description',
    type: 'public',
    status: 'CLOSED',
    totalVotes: 10,
    options: [
      {
        id: '1',
        text: 'Option 1',
        votesCount: 6,
        createdAt: '2023-01-01T00:00:00Z',
      },
      {
        id: '2',
        text: 'Option 2',
        votesCount: 4,
        createdAt: '2023-01-01T00:00:00Z',
      },
    ],
    creator: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T01:00:00Z',
  };

  const mockOpenPoll: Poll = {
    ...mockClosedPoll,
    status: 'OPEN',
  };

  it('should not render for open polls', () => {
    render(<PollChart poll={mockOpenPoll} />);
    expect(screen.queryByText('Resultados da Votação')).not.toBeInTheDocument();
  });

  it('should render chart for closed polls', () => {
    render(<PollChart poll={mockClosedPoll} />);
    expect(screen.getByText('Resultados da Votação')).toBeInTheDocument();
    expect(screen.getByText(/Total de votos:/i)).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should render doughnut chart by default', () => {
    render(<PollChart poll={mockClosedPoll} />);
    expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
  });

  it('should switch to bar chart when bar button is clicked', () => {
    render(<PollChart poll={mockClosedPoll} />);

    const barButton = screen.getByTitle('Gráfico de Barras');
    fireEvent.click(barButton);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('doughnut-chart')).not.toBeInTheDocument();
  });

  it('should display statistics for each option', () => {
    render(<PollChart poll={mockClosedPoll} />);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('6 votos (60.0%)')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('4 votos (40.0%)')).toBeInTheDocument();
  });

  it('should show no votes message when there are no votes', () => {
    const noVotesPoll = {
      ...mockClosedPoll,
      totalVotes: 0,
      options: mockClosedPoll.options.map((option) => ({
        ...option,
        votesCount: 0,
      })),
    };

    render(<PollChart poll={noVotesPoll} />);
    expect(
      screen.getByText('Nenhum voto foi registrado nesta votação.')
    ).toBeInTheDocument();
  });

  it('should filter out options with zero votes from chart', () => {
    const mixedVotesPoll = {
      ...mockClosedPoll,
      options: [
        ...mockClosedPoll.options,
        {
          id: '3',
          text: 'Option 3',
          votesCount: 0,
          createdAt: '2023-01-01T00:00:00Z',
        },
      ],
    };

    render(<PollChart poll={mixedVotesPoll} />);

    // Should display options with votes in statistics
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();

    // Option with zero votes should not be in the chart data
    const chartElement = screen.getByTestId('doughnut-chart');
    const chartData = JSON.parse(
      chartElement.getAttribute('data-chart-data') || '{}'
    );
    expect(chartData.labels).toEqual(['Option 1', 'Option 2']);
  });
});
