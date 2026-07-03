import LoginForm from "@/features/auth/components/LoginForm";
import SEO from "@/components/common/SEO";
import { useSEO } from "@/hooks/useSEO";

function Login() {
  const { seoProps } = useSEO({
    title: 'Sign In | Shop Fashion',
    description: 'Sign in to your Shop Fashion account to access your orders and wishlist.',
    robots: 'noindex,nofollow',
  });

  return (
    <main
      className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <SEO {...seoProps} />
      <LoginForm />
    </main>
  );
}

export default Login;
