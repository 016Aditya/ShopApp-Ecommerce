import { forwardRef } from "react";

/**
 * Input — enhanced common input.
 * Accepts an optional `rightElement` prop (JSX) rendered inside
 * the input wrapper on the right side — used by auth forms for
 * the password eye-toggle button.
 */
const Input = forwardRef(function Input(
  {
    label,
    id,
    name,
    type = "text",
    error,
    helperText,
    className = "",
    rightElement,
    ...props
  },
  ref
) {
  const inputId = id || name;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          className={[
            "w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all duration-200",
            rightElement ? "pr-10" : "",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "focus:ring-2",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            backgroundColor: "var(--input-bg)",
            borderColor: error ? undefined : "var(--input-border)",
            color: "var(--text-primary)",
            "--tw-ring-color": "var(--input-focus)",
          }}
          {...props}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs" style={{ color: "var(--error-text)" }}>
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
