import LoginForm from "@/features/auth/components/LoginForm";

function Login() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 p-6">
      <LoginForm />
    </div>
  );
}

export default Login;