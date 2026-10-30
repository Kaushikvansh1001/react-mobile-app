import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import '../styles/signup.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="signup">
      <StatusBar />
      <h1>Page not found</h1>
      <p className="signup-copy">That screen is not part of this Fastor app.</p>
      <button type="button" className="otp-button" onClick={() => navigate('/')}>
        Back to start
      </button>
    </main>
  );
}
