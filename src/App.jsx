import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';

function CartBoundary() {
  const { isAuthenticated } = useAuth();

  return (
    <CartProvider key={isAuthenticated ? 'signed-in' : 'signed-out'}>
      <AppRoutes />
    </CartProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartBoundary />
      </AuthProvider>
    </BrowserRouter>
  );
}
