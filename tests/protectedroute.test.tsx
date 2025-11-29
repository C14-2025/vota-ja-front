import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../src/routes/ProtectedRoute';
import { AuthProvider } from '../src/contexts/AuthContext';

const MockProtectedContent = () => <div>Protected Content</div>;
const MockLoginPage = () => <div>Login Page</div>;

describe('ProtectedRoute', () => {
  it('should be defined', () => {
    expect(ProtectedRoute).toBeDefined();
    expect(typeof ProtectedRoute).toBe('function');
  });

  it('should redirect to /login when not authenticated', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/login" element={<MockLoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/protected" element={<MockProtectedContent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText('Login Page')).toBeTruthy();
    expect(screen.queryByText('Protected Content')).toBeNull();
  });
});
