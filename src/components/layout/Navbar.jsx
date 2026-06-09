import { Link, useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import useCart from "@/features/cart/hooks/useCart";
import useAuth from "@/features/auth/hooks/useAuth";

function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(PATHS.LOGIN);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="container-app flex h-16 items-center justify-between">
        <Link
          to={PATHS.HOME}
          className="text-xl font-bold text-slate-900 hover:text-blue-600"
        >
          ShopApp
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link to={PATHS.HOME} className="hover:text-blue-600">
            Home
          </Link>

          <Link to={PATHS.SHOP} className="hover:text-blue-600">
            Shop
          </Link>

          <Link to={PATHS.CART} className="relative hover:text-blue-600">
            Cart
            {totalItems > 0 ? (
              <span className="absolute -right-4 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
                {totalItems}
              </span>
            ) : null}
          </Link>

          {user ? (
            <>
              <Link to={PATHS.PROFILE} className="hover:text-blue-600">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to={PATHS.LOGIN}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;