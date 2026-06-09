function Input({
  label,
  id,
  name,
  type = "text",
  error,
  helperText,
  className = "",
  ...props
}) {
  return (
    <div className="w-full space-y-1.5">
      {label ? (
        <label
          htmlFor={id || name}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      ) : null}

      <input
        id={id || name}
        name={name}
        type={type}
        className={[
          "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition",
          "placeholder:text-slate-400 focus:ring-2",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-200"
            : "border-slate-300 focus:border-blue-500 focus:ring-blue-200",
          className,
        ].join(" ")}
        {...props}
      />

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : helperText ? (
        <p className="text-sm text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}

export default Input;