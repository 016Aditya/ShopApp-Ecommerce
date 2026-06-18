import RegisterForm from "@/features/auth/components/RegisterForm";

function Register() {
  return (
    <div
      className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <RegisterForm />
    </div>
  );
}

export default Register;
