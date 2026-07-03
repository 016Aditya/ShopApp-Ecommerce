import { useEffect, useRef } from 'react';
import { env } from '@/config/env';

const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script';
const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile);

  const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID);
  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(window.turnstile), { once: true });
      existingScript.addEventListener('error', reject, { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function TurnstileWidget({ onVerify, onExpire, onError }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    if (!env.TURNSTILE_SITE_KEY || !containerRef.current) {
      return undefined;
    }

    loadTurnstileScript()
      .then((turnstile) => {
        if (!isMounted || !turnstile || !containerRef.current) return;
        if (widgetIdRef.current !== null) return;

        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: env.TURNSTILE_SITE_KEY,
          theme: 'auto',
          callback: (token) => onVerify?.(token),
          'expired-callback': () => onExpire?.(),
          'timeout-callback': () => onExpire?.(),
          'error-callback': () => onError?.(),
        });
      })
      .catch(() => {
        if (isMounted) onError?.();
      });

    return () => {
      isMounted = false;
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [onError, onExpire, onVerify]);

  return (
    <div
      className="rounded-xl border p-3"
      style={{
        borderColor: 'var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
      }}
    >
      <div ref={containerRef} />
    </div>
  );
}

export default TurnstileWidget;
