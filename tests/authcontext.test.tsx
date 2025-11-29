import { render, act, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

describe('AuthContext', () => {
  it('should start with isAuthenticated as false', () => {
    const TestComponent = () => {
      const { isAuthenticated } = useAuth();
      return (
        <div>{isAuthenticated ? 'authenticated' : 'not authenticated'}</div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('not authenticated')).toBeTruthy();
  });

  it('should set isAuthenticated to true when login is called', () => {
    const TestComponent = () => {
      const { isAuthenticated, login } = useAuth();
      return (
        <div>
          <span>{isAuthenticated ? 'authenticated' : 'not authenticated'}</span>
          <button onClick={login}>Login</button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('not authenticated')).toBeTruthy();

    act(() => {
      screen.getByText('Login').click();
    });

    expect(screen.getByText('authenticated')).toBeTruthy();
  });

  it('should set isAuthenticated to false when logout is called', () => {
    const TestComponent = () => {
      const { isAuthenticated, login, logout } = useAuth();
      return (
        <div>
          <span>{isAuthenticated ? 'authenticated' : 'not authenticated'}</span>
          <button onClick={login}>Login</button>
          <button onClick={logout}>Logout</button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Login').click();
    });
    expect(screen.getByText('authenticated')).toBeTruthy();

    act(() => {
      screen.getByText('Logout').click();
    });
    expect(screen.getByText('not authenticated')).toBeTruthy();
  });
});
