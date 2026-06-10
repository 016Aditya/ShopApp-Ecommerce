import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import PATHS from "@/routes/paths";
import useCart from "@/features/cart/hooks/useCart";
import useAuth from "@/features/auth/hooks/useAuth";

function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`${PATHS.PRODUCTS}?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate(PATHS.LOGIN);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#2874f0] shadow-md">
      <div className="container-app flex h-16 items-center gap-4">
        {/* Logo */}
        <Link to={PATHS.HOME} className="flex-shrink-0">
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold italic text-white tracking-tight">ShopApp</span>
            <span className="text-[10px] text-yellow-300 font-medium italic">Explore <span className="underline">Plus</span> ✦</span>
          </div>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl">
          <div className="flex w-full overflow-hidden rounded-sm shadow-sm">
            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm text-slate-800 outline-none"
            />
            <button
              type="submit"
              className="flex items-center justify-center bg-[#2874f0] px-4 hover:bg-[#1a65e0] transition"
              aria-label="Search"
            >
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-5 ml-auto flex-shrink-0">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to={PATHS.PROFILE} className="text-sm font-semibold text-white hover:text-yellow-300 transition">
                {user.name || "Account"}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-white hover:text-yellow-300 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to={PATHS.LOGIN}
              className="rounded-sm bg-white px-8 py-1.5 text-sm font-bold text-[#2874f0] hover:bg-slate-100 transition"
            >
              Login
            </Link>
          )}

          <Link to={PATHS.CART} className="relative flex items-center gap-1.5 text-white hover:text-yellow-300 transition">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            <span className="text-sm font-bold">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff6161] text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
