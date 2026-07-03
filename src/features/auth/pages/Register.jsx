import RegisterForm from "@/features/auth/components/RegisterForm";
import SEO from "@/components/common/SEO";
import { useSEO } from "@/hooks/useSEO";

function Register() {
  const { seoProps } = useSEO({
    title: 'Create Account | Shop Fashion',
    description: 'Create a new Shop Fashion account to start shopping.',
    robots: 'noindex,nofollow',
  });

  return (
    <main
      className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <SEO {...seoProps} />
      <RegisterForm />
    </main>
  );
}

export default Register;
