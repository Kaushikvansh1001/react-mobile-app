import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import NumberKeypad from '../components/NumberKeypad';
import OtpInput from '../components/OtpInput';
import StatusBar from '../components/StatusBar';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import { registerUser } from '../services/authService';
import '../styles/signup.css';

const CODE_LENGTH = 6;

function formatPhone(digits = '', dialCode = '+91') {
  if (!digits) {
    return dialCode;
  }

  if (digits.length <= 5) {
    return `${dialCode} ${digits}`;
  }

  return `${dialCode} ${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
}

function formatTimer(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remaining = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${remaining}`;
}

export default function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const phone = location.state?.phone || '';
  const dialCode = location.state?.dialCode || '+91';
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (!phone) {
      navigate('/signup', { replace: true });
    }
  }, [navigate, phone]);

  useEffect(() => {
    if (signedIn) {
      navigate('/home', { replace: true });
    }
  }, [navigate, signedIn]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function appendDigit(digit) {
    setCode((current) => (current.length >= CODE_LENGTH ? current : current + digit));
    setError('');
  }

  function removeDigit() {
    setCode((current) => current.slice(0, -1));
    setError('');
  }

  async function handleResend() {
    setResending(true);
    setError('');

    try {
      await registerUser({ phone, dialCode });
      setCode('');
      setSecondsLeft(30);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setResending(false);
    }
  }

  async function handleContinue() {
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login({ phone, otp: code, dialCode });
      setSignedIn(true);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="signup">
      <StatusBar />

      <button type="button" className="back-button" aria-label="Go back" onClick={() => navigate(-1)}>
        <ChevronLeft size={28} strokeWidth={2.25} />
      </button>

      <h1>6-digit code</h1>
      <p className="signup-copy">
        Please enter the code we've sent to
        <br />
        {formatPhone(phone, dialCode)}
      </p>

      <OtpInput value={code} onChange={setCode} />

      {secondsLeft > 0 ? (
        <p className="resend-copy">
          I didn't receive a code <span>({formatTimer(secondsLeft)})</span>
        </p>
      ) : (
        <p className="resend-copy">
          I didn't receive a code{' '}
          <button type="button" onClick={handleResend} disabled={resending}>
            {resending ? 'Sending...' : 'Resend OTP'}
          </button>
        </p>
      )}

      {error ? <p className="form-error">{error}</p> : null}

      <div className="otp-footer">
        <button
          type="button"
          className="otp-button"
          onClick={handleContinue}
          disabled={loading || code.length !== CODE_LENGTH}
        >
          {loading ? 'Checking...' : 'Continue'}
        </button>
        <NumberKeypad onDigit={appendDigit} onDelete={removeDigit} />
      </div>
    </main>
  );
}
