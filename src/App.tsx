import { AppRoutes } from './routes';
import { AuthProvider } from './contexts';
import { AppToast } from './common/Toast';

function App() {
  return (
    <AuthProvider>
      <AppToast />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
