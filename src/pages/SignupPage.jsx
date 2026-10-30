import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import NumberKeypad from '../components/NumberKeypad';
import StatusBar from '../components/StatusBar';
import { getErrorMessage } from '../services/api';
import { registerUser } from '../services/authService';
import '../styles/signup.css';

const DIAL_CODE = '+91';
const PHONE_PATTERN = /^[6-9]\d{9}$/;

export default function SignupPage() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function appendDigit(digit) {
    setDigits((current) => (current.length >= 10 ? current : current + digit));
    setError('');
  }

  function removeDigit() {
    setDigits((current) => current.slice(0, -1));
    setError('');
  }

  async function handleGetOtp() {
    if (!PHONE_PATTERN.test(digits)) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await registerUser({ phone: digits, dialCode: DIAL_CODE });
      navigate('/verify-otp', { state: { phone: digits, dialCode: DIAL_CODE } });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="signup">
      <StatusBar />

      <button
        type="button"
        className="back-button"
        aria-label="Go back"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={28} strokeWidth={2.25} />
      </button>

      <h1>Sign Up to Fastor</h1>
      <p className="signup-copy">
        Let us know your mobile number and we will send you an OTP for verification.
      </p>

      <label className="phone-field">
        <span className="country-code">{DIAL_CODE}</span>
        <span className="caret" aria-hidden="true" />
        <span className="field-divider" aria-hidden="true" />
        <input
          className="phone-digits"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          autoFocus
          maxLength={10}
          placeholder="- 00000"
          aria-label="Mobile number"
          value={digits}
          onChange={(event) => {
            setDigits(event.target.value.replace(/\D/g, '').slice(0, 10));
            setError('');
          }}
        />
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <button type="button" className="otp-button" onClick={handleGetOtp} disabled={loading}>
        {loading ? 'Sending OTP...' : 'Get OTP'}
      </button>

      <p className="legal-copy">
        By clicking, I accept the <button type="button">Terms &amp; Conditions</button> and{' '}
        <button type="button">Privacy Policy</button>
      </p>

      <NumberKeypad onDigit={appendDigit} onDelete={removeDigit} />
    </main>
  );
}
