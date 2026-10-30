import { useEffect, useRef } from 'react';

const CODE_LENGTH = 6;

export default function OtpInput({ value, onChange }) {
  const refs = useRef([]);

  useEffect(() => {
    const index = Math.min(value.length, CODE_LENGTH - 1);
    refs.current[index]?.focus();
  }, [value]);

  function writeAt(index, digit) {
    if (index > value.length) {
      return;
    }

    if (index === value.length) {
      onChange((value + digit).slice(0, CODE_LENGTH));
      return;
    }

    onChange(value.slice(0, index) + digit + value.slice(index + 1));
  }

  function handleChange(index, event) {
    const digits = event.target.value.replace(/\D/g, '');
    if (!digits) {
      return;
    }

    if (digits.length > 1) {
      onChange((value.slice(0, index) + digits).replace(/\D/g, '').slice(0, CODE_LENGTH));
      return;
    }

    writeAt(index, digits);
  }

  function handleKeyDown(index, event) {
    if (event.key !== 'Backspace') {
      return;
    }

    event.preventDefault();

    if (value[index]) {
      onChange(value.slice(0, index) + value.slice(index + 1));
      return;
    }

    if (index === 0) {
      return;
    }

    onChange(value.slice(0, index - 1) + value.slice(index));
    refs.current[index - 1]?.focus();
  }

  function handlePaste(event) {
    event.preventDefault();
    const digits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (digits) {
      onChange(digits);
    }
  }

  const boxes = Array.from({ length: CODE_LENGTH }, (_, index) => value[index] || '');

  return (
    <div className="otp-boxes" aria-label="6-digit code">
      {boxes.slice(0, 3).map((digit, index) => (
        <div className="otp-box" key={index}>
          <input
            ref={(node) => {
              refs.current[index] = node;
            }}
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            aria-label={`Digit ${index + 1}`}
            value={digit}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
          />
        </div>
      ))}
      <span className="otp-dash" aria-hidden="true">
        -
      </span>
      {boxes.slice(3).map((digit, index) => {
        const position = index + 3;
        return (
          <div className="otp-box" key={position}>
            <input
              ref={(node) => {
                refs.current[position] = node;
              }}
              inputMode="numeric"
              autoComplete="off"
              aria-label={`Digit ${position + 1}`}
              value={digit}
              onChange={(event) => handleChange(position, event)}
              onKeyDown={(event) => handleKeyDown(position, event)}
              onPaste={handlePaste}
            />
          </div>
        );
      })}
    </div>
  );
}
