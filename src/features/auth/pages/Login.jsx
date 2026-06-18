import LoginForm from "@/features/auth/components/LoginForm";

function Login() {
  return (
    // FIX: removed hardcoded bg-slate-50 — now uses CSS variable so dark mode applies
    <div
      className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <LoginForm />
    </div>
  );
}

export default Login;
