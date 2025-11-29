import { render, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

describe('AuthContext', () => {
  it('should start with isAuthenticated as false', () => {
    let authValue: any;

    const TestComponent = () => {
      authValue = useAuth();
      return null;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(authValue.isAuthenticated).toBe(false);
  });

  it('should set isAuthenticated to true when login is called', () => {
    let authValue: any;

    const TestComponent = () => {
      authValue = useAuth();
      return null;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      authValue.login();
    });

    expect(authValue.isAuthenticated).toBe(true);
  });

  it('should set isAuthenticated to false when logout is called', () => {
    let authValue: any;

    const TestComponent = () => {
      authValue = useAuth();
      return null;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      authValue.login();
    });
    expect(authValue.isAuthenticated).toBe(true);

    act(() => {
      authValue.logout();
    });
    expect(authValue.isAuthenticated).toBe(false);
  });
});
