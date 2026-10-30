import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import NotFoundPage from '../pages/NotFoundPage';
import SignupPage from '../pages/SignupPage';
import OtpPage from '../pages/OtpPage';
import HomePage from '../pages/HomePage';
import ProductPage from '../pages/ProductPage';
import { GuestRoute, ProtectedRoute } from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route element={<GuestRoute />}>
          <Route index element={<Navigate to="/signup" replace />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="verify-otp" element={<OtpPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="home" element={<HomePage />} />
          <Route path="product/:id" element={<ProductPage />} />
        </Route>

        <Route path="verify" element={<Navigate to="/verify-otp" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
