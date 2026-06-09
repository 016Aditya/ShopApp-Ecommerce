import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

function OAuth2Success() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(PATHS.HOME);
  }, [navigate]);

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          Login successful
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Redirecting you to the home page...
        </p>
      </div>
    </div>
  );
}

export default OAuth2Success;