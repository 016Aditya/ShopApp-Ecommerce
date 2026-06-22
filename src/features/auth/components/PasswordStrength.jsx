/**
 * PasswordStrength
 *
 * Live password checklist + animated strength bar.
 * Shown below the Password field on Register and Reset Password.
 *
 * Rules:
 *   r1  >= 8 characters
 *   r2  at least one uppercase letter
 *   r3  at least one lowercase letter
 *   r4  at least two digits
 *   r5  at least one special character
 *
 * Strength:
 *   0-2 passed → Weak   (#ef4444)
 *   3-4 passed → Medium (#f59e0b)
 *   5   passed → Strong (#22c55e)
 */

const RULES = [
  { id: "r1", label: "8 Characters",       test: (p) => p.length >= 8 },
  { id: "r2", label: "One Uppercase",       test: (p) => /[A-Z]/.test(p) },
  { id: "r3", label: "One Lowercase",       test: (p) => /[a-z]/.test(p) },
  { id: "r4", label: "Two Numbers",         test: (p) => (p.match(/\d/g) || []).length >= 2 },
  { id: "r5", label: "One Special Character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export function getPasswordScore(password) {
  return RULES.filter((r) => r.test(password)).length;
}

export function isPasswordValid(password) {
  return getPasswordScore(password) === RULES.length;
}

function PasswordStrength({ password }) {
  if (!password) return null;

  const score   = getPasswordScore(password);
  const label   = score <= 2 ? "Weak" : score <= 4 ? "Medium" : "Strong";
  const color   = score <= 2 ? "#ef4444" : score <= 4 ? "#f59e0b" : "#22c55e";
  const width   = `${(score / RULES.length) * 100}%`;

  return (
    <div className="space-y-3 pt-1">
      {/* Strength bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Password Strength
          </span>
          <span className="text-xs font-semibold" style={{ color }}>
            {label}
          </span>
        </div>
        <div
          className="h-1.5 w-full rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--border-color)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width,
              backgroundColor: color,
              transition: "width 0.25s ease, background-color 0.25s ease",
            }}
          />
        </div>
      </div>

      {/* Checklist */}
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {RULES.map((rule) => {
          const passed = rule.test(password);
          return (
            <li
              key={rule.id}
              className="flex items-center gap-1.5 text-xs"
              style={{ color: passed ? "#22c55e" : "var(--text-secondary)" }}
            >
              <span
                className="flex-shrink-0 text-[10px] font-bold leading-none"
                aria-hidden="true"
              >
                {passed ? "✓" : "✗"}
              </span>
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PasswordStrength;
