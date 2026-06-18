import LoginForm from "@/features/auth/components/LoginForm";

function Login() {
  return (
    <div
      className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <LoginForm />
    </div>
  );
}

export default Login;
