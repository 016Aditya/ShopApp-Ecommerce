import ErrorBoundary from "@/errors/ErrorBoundary";
import { AuthProvider } from "@/features/auth/context/AuthContext";

function Providers({ children }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default Providers;