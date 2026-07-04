import { forwardRef, useEffect } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { env } from '@/config/env';

const TurnstileWidget = forwardRef(function TurnstileWidget(
  { onVerify, onExpire, onError },
  ref
) {
  useEffect(() => {
    if (env.IS_DEV) {
      console.log('Turnstile Site Key:', env.TURNSTILE_SITE_KEY);
    }
  }, []);

  if (!env.TURNSTILE_SITE_KEY) {
    return (
      <div
        className="rounded-xl border p-3 text-sm"
        style={{
          borderColor: 'var(--warning-border)',
          backgroundColor: 'var(--warning-bg)',
          color: 'var(--warning-text)',
        }}
      >
        CAPTCHA is unavailable because `VITE_TURNSTILE_SITE_KEY` is missing.
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border p-3"
      style={{
        borderColor: 'var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
      }}
    >
      <Turnstile
        ref={ref}
        siteKey={env.TURNSTILE_SITE_KEY}
        onSuccess={(token) => onVerify?.(token)}
        onExpire={() => onExpire?.()}
        onError={() => onError?.()}
      />
    </div>
  );
});

export default TurnstileWidget;
