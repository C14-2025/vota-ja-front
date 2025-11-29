import { AppRoutes } from './routes';
import { AuthProvider } from './contexts';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
