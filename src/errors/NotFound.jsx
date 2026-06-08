import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="mb-2 text-6xl font-bold text-gray-800">404</h1>
      <p className="mb-2 text-2xl font-semibold text-gray-600">
        Page Not Found
      </p>
      <p className="mb-8 text-gray-400">
        The page you are looking for does not exist.
      </p>
      <Link
        to={PATHS.HOME}
        className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
      >
        Go to Home
      </Link>
    </div>
  );
}

export default NotFound;