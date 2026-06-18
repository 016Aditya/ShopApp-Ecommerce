import RegisterForm from "@/features/auth/components/RegisterForm";

function Register() {
  return (
    // FIX: removed hardcoded bg-slate-50 — now uses CSS variable so dark mode applies
    <div
      className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <RegisterForm />
    </div>
  );
}

export default Register;
