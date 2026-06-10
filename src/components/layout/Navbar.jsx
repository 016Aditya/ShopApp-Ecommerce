import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import PATHS from "@/routes/paths";
import useCart from "@/features/cart/hooks/useCart";
import useAuth from "@/features/auth/hooks/useAuth";

const NAV_LINKS = [
  { label: "Today's Deals", path: PATHS.PRODUCTS },
  { label: "Mobiles", path: `${PATHS.PRODUCTS}?category=Electronics` },
  { label: "Electronics", path: `${PATHS.PRODUCTS}?category=Electronics` },
  { label: "Fashion", path: `${PATHS.PRODUCTS}?category=Clothing` },
  { label: "Home & Kitchen", path: `${PATHS.PRODUCTS}?category=Home` },
  { label: "Books", path: `${PATHS.PRODUCTS}?category=Books` },
  { label: "Sports", path: `${PATHS.PRODUCTS}?category=Sports` },
  { label: "New Releases", path: PATHS.PRODUCTS },
  { label: "Customer Service", path: PATHS.PRODUCTS },
];

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
    <header className="sticky top-0 z-50 shadow-md">

      {/* ── Row 1: Logo + Search + Account/Orders/Cart ── */}
      <div className="bg-[#131921]">
        <div className="container-app flex h-14 items-center gap-3">

          {/* Logo */}
          <Link
            to={PATHS.HOME}
            className="flex-shrink-0 flex flex-col items-center rounded border border-transparent px-1 py-0.5 hover:border-white transition"
          >
            <span className="text-[18px] font-extrabold text-white tracking-tight leading-none">
              shop<span className="text-[#ff9900]">App</span>
            </span>
            <span className="text-[9px] text-slate-300 leading-none">.in</span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-1">
            <div className="flex w-full overflow-hidden rounded-sm">
              <input
                type="text"
                placeholder="Search products, brands and more..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-4 py-2 text-sm text-slate-800 outline-none"
              />
              <button
                type="submit"
                className="flex items-center justify-center bg-[#ff9900] px-4 hover:bg-[#e88a00] transition"
                aria-label="Search"
              >
                <svg className="h-5 w-5 text-slate-900" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </div>
          </form>

          {/* Account */}
          {user ? (
            <div className="group relative flex-shrink-0 flex cursor-pointer flex-col rounded border border-transparent px-2 py-1 hover:border-white transition">
              <span className="text-[10px] text-slate-300">Hello, {user.name || "User"}</span>
              <span className="text-sm font-bold text-white">Account ▾</span>
              <div className="absolute top-full right-0 z-50 hidden w-48 rounded bg-white shadow-xl group-hover:block">
                <Link to={PATHS.PROFILE} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Profile</Link>
                <Link to={PATHS.ORDERS} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">My Orders</Link>
                <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100">Sign Out</button>
              </div>
            </div>
          ) : (
            <Link
              to={PATHS.LOGIN}
              className="flex-shrink-0 flex flex-col rounded border border-transparent px-2 py-1 hover:border-white transition"
            >
              <span className="text-[10px] text-slate-300">Hello, sign in</span>
              <span className="text-sm font-bold text-white">Account &amp; Lists ▾</span>
            </Link>
          )}

          {/* Returns & Orders */}
          <Link
            to={PATHS.ORDERS}
            className="flex-shrink-0 flex flex-col rounded border border-transparent px-2 py-1 hover:border-white transition"
          >
            <span className="text-[10px] text-slate-300">Returns</span>
            <span className="text-sm font-bold text-white">&amp; Orders</span>
          </Link>

          {/* Cart */}
          <Link
            to={PATHS.CART}
            className="flex-shrink-0 relative flex items-end gap-1 rounded border border-transparent px-2 py-1 hover:border-white transition"
          >
            <div className="relative">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 left-4 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff9900] text-[11px] font-extrabold text-slate-900">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="mb-1 text-sm font-bold text-white">Cart</span>
          </Link>

        </div>
      </div>

      {/* ── Row 2: Dark nav links bar ── */}
      <div className="bg-[#232f3e]">
        <div className="container-app flex items-center overflow-x-auto scrollbar-hide">

          {/* ☰ All */}
          <Link
            to={PATHS.PRODUCTS}
            className="flex flex-shrink-0 items-center gap-1.5 border border-transparent px-3 py-2 text-sm font-bold text-white hover:border-white transition"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5h14a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm0 4h14a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm0 4h14a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2z" clipRule="evenodd" />
            </svg>
            All
          </Link>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="flex-shrink-0 border border-transparent px-3 py-2 text-sm text-white hover:border-white transition whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

    </header>
  );
}

export default Navbar;
