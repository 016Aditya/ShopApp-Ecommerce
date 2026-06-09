import RegisterForm from "@/features/auth/components/RegisterForm";

function Register() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 p-6">
      <RegisterForm />
    </div>
  );
}

export default Register;