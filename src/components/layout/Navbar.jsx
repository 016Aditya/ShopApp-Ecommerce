import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import PATHS from "@/routes/paths";
import { useWishlistStore } from "@/store";
import { useCartQuery } from "@/features/cart/hooks/useCart";
import useAuth from "@/features/auth/hooks/useAuth";
import ThemeToggle from "@/components/common/ThemeToggle";

const CLOTHING_SUBS = [
  { label: "All Fashion", sub: null },
  { label: "Shirt",   sub: "Shirt"  },
  { label: "Jeans",   sub: "Jeans"  },
  { label: "Dress",   sub: "Dress"  },
  { label: "Shoes",   sub: "Shoes"  },
  { label: "Jacket",  sub: "Jacket" },
  { label: "Kurta",   sub: "Kurta"  },
];

const NAV_LINKS = [
  { label: "Today's Deals",   path: PATHS.PRODUCTS,  dropdown: null },
  { label: "Mobiles",         path: `${PATHS.PRODUCTS}?category=Electronics&subcategory=Mobile`, dropdown: null },
  { label: "Fashion",         path: `${PATHS.PRODUCTS}?category=Clothing`, dropdown: CLOTHING_SUBS },
  { label: "Electronics",     path: `${PATHS.PRODUCTS}?category=Electronics`, dropdown: null },
  { label: "Home & Kitchen",  path: `${PATHS.PRODUCTS}?category=Home`,        dropdown: null },
  { label: "Books",           path: `${PATHS.PRODUCTS}?category=Books`,        dropdown: null },
  { label: "Sports",          path: `${PATHS.PRODUCTS}?category=Sports`,       dropdown: null },
  { label: "New Releases",    path: PATHS.PRODUCTS,  dropdown: null },
  { label: "Customer Service",path: PATHS.CUSTOMER_SERVICE, dropdown: null },
];

function Navbar() {
  // ── Cart count — source from TanStack Query (server state) ──────────────────
  // cartStore no longer holds items[] (stripped to UI flags only).
  // useCartQuery returns { data: { items, cartTotal } | undefined }.
  // Fall back to [] so .reduce() is always called on an array, never undefined.
  const { data: cartData } = useCartQuery();
  const cartItems  = cartData?.items ?? [];
  const totalItems = cartItems.reduce((sum, i) => sum + (i.quantity ?? 0), 0);

  // ── Wishlist count — still in Zustand (client-side persist) ──────────────
  const wishlistItems = useWishlistStore((s) => s.items);
  const wishlistCount = wishlistItems.length;

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`${PATHS.PRODUCTS}?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleLogout = () => {
    // authStore.logout() clears user + token from Zustand + localStorage.
    // The Axios interceptor already cleared auth-storage on 401 if that was
    // the trigger. Either way, cart data is invalidated automatically because
    // useCartQuery is disabled when user is null (enabled: !!userId).
    logout();
    navigate(PATHS.LOGIN);
  };

  const displayName = user?.firstName || user?.name || "User";

  return (
    <header className="sticky top-0 z-50 shadow-md" style={{ colorScheme: "dark" }}>

      {/* ═══════════════════════════════════════════════════════════════════
          PRIMARY BAR
          Desktop  (md+):  single flex row — Logo Search Account Orders Wishlist Cart Theme
          Mobile   (<md):  wraps into 2 rows via .navbar-primary-inner CSS:
                           Row 1 → Logo  ·············  [Account] [Wishlist] [Cart] [Theme]
                           Row 2 → Search bar (full width)
      ═══════════════════════════════════════════════════════════════════ */}
      <div style={{ backgroundColor: "var(--navbar-bg)" }}>
        <div
          className="navbar-primary-inner container-app flex items-center gap-3"
          style={{ minHeight: "52px" }}
        >

          {/* ── Logo — always visible, both breakpoints ── */}
          <Link
            to={PATHS.HOME}
            className="navbar-logo flex-shrink-0 flex flex-col items-center rounded border border-transparent px-1 py-0.5 hover:border-white hover:opacity-90 transition"
            style={{ cursor: "pointer" }}
            aria-label="ShopApp Home"
          >
            <span className="text-[18px] font-extrabold text-white tracking-tight leading-none">
              shop<span style={{ color: "var(--accent)" }}>App</span>
            </span>
            <span className="text-[9px] text-slate-300 leading-none">.in</span>
          </Link>

          {/* ── Search ── */}
          <form onSubmit={handleSearch} className="navbar-search flex flex-1">
            <div
              className="flex w-full overflow-hidden rounded-sm"
              style={{
                outline: searchFocused
                  ? "2px solid var(--accent)"
                  : "2px solid var(--accent)",
                boxShadow: searchFocused
                  ? "0 0 0 3px rgba(255,159,0,0.28)"
                  : "none",
                transition: "box-shadow 0.2s ease",
              }}
            >
              <input
                type="text"
                placeholder="Search products, brands and more..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 px-4 py-2 text-sm outline-none"
                style={{ backgroundColor: "#fff", color: "#0f0f11", border: "none" }}
              />
              <button
                type="submit"
                className="flex items-center justify-center px-4 hover:opacity-90 transition"
                style={{ backgroundColor: "var(--accent)" }}
                aria-label="Search"
              >
                <svg className="h-5 w-5" style={{ color: "var(--accent-text)" }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </div>
          </form>

          {/* ── Account ── */}
          {user ? (
            <>
              {/* Desktop account block */}
              <div className="group relative hidden md:flex flex-shrink-0 cursor-pointer flex-col rounded border border-transparent px-2 py-1 hover:border-white transition">
                <span className="text-[10px] text-slate-300" style={{ lineHeight: 1.4 }}>Hello, {displayName}</span>
                <span className="text-sm font-bold text-white" style={{ lineHeight: 1.4 }}>Account</span>
                <div className="absolute top-full right-0 z-50 hidden w-48 rounded shadow-xl group-hover:block" style={{ backgroundColor: "var(--modal-bg)", border: "1px solid var(--border-color)" }}>
                  <Link to={PATHS.PROFILE}  className="block px-4 py-2 text-sm hover:opacity-80 transition" style={{ color: "var(--text-primary)" }}>Profile</Link>
                  <Link to={PATHS.ORDERS}   className="block px-4 py-2 text-sm hover:opacity-80 transition" style={{ color: "var(--text-primary)" }}>My Orders</Link>
                  <Link to={PATHS.WISHLIST} className="block px-4 py-2 text-sm hover:opacity-80 transition" style={{ color: "var(--text-primary)" }}>
                    Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                  </Link>
                  <hr style={{ borderColor: "var(--border-color)" }} />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                    className="block w-full px-4 py-2 text-left text-sm hover:opacity-80 transition"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Mobile account pill */}
              <Link
                to={PATHS.PROFILE}
                className="flex-shrink-0 flex flex-col items-end rounded border border-transparent px-1 py-0.5 hover:border-white transition md:hidden"
                aria-label="My Account"
              >
                <span className="leading-none" style={{ fontSize: "0.7rem", color: "#cbd5e1", lineHeight: 1.4 }}>
                  Hello, {displayName}
                </span>
                <span className="font-semibold text-white leading-none" style={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
                  Account
                </span>
              </Link>
            </>
          ) : (
            <Link
              to={PATHS.LOGIN}
              className="flex-shrink-0 flex flex-col rounded border border-transparent px-2 py-1 hover:border-white transition"
            >
              <span className="text-[10px] text-slate-300" style={{ lineHeight: 1.4 }}>Hello, sign in</span>
              <span className="text-sm font-bold text-white" style={{ lineHeight: 1.4 }}>Account &amp; Lists</span>
            </Link>
          )}

          {/* ── Orders — desktop only ── */}
          <Link
            to={PATHS.ORDERS}
            className="hidden md:flex flex-shrink-0 flex-col rounded border border-transparent px-2 py-1 hover:border-white transition"
          >
            <span className="text-[10px] text-slate-300" style={{ lineHeight: 1.4 }}>Returns</span>
            <span className="text-sm font-bold text-white" style={{ lineHeight: 1.4 }}>&amp; Orders</span>
          </Link>

          {/* ── Wishlist icon ── */}
          <Link
            to={PATHS.WISHLIST}
            className="flex-shrink-0 relative flex items-end gap-1 rounded border border-transparent px-2 py-1 hover:border-white transition"
            aria-label="Wishlist"
          >
            <div className="relative">
              <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 left-4 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-extrabold" style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}>
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </div>
            <span className="mb-1 hidden text-sm font-bold text-white md:inline">Wishlist</span>
          </Link>

          {/* ── Cart icon ── */}
          <Link
            to={PATHS.CART}
            className="flex-shrink-0 relative flex items-end gap-1 rounded border border-transparent px-2 py-1 hover:border-white transition"
            aria-label="Cart"
          >
            <div className="relative">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 left-4 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-extrabold" style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}>
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </div>
            <span className="mb-1 hidden text-sm font-bold text-white md:inline">Cart</span>
          </Link>

          <ThemeToggle />
        </div>
      </div>

      {/* ── Category bar ────────────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "var(--navbar-secondary-bg)" }}>
        <div
          className="navbar-category-bar container-app"
          style={{
            display: "flex",
            alignItems: "center",
            overflowX: "auto",
            whiteSpace: "nowrap",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            gap: "0",
            minHeight: "40px",
          }}
        >
          <Link
            to={PATHS.PRODUCTS}
            className="navbar-cat-item flex flex-shrink-0 items-center gap-1.5 border border-transparent px-3 py-2 text-sm font-bold text-white hover:border-white transition"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5h14a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm0 4h14a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm0 4h14a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2z" clipRule="evenodd" />
            </svg>
            All
          </Link>

          {NAV_LINKS.map((link) =>
            link.dropdown ? (
              <div key={link.label} className="group relative flex-shrink-0">
                <Link
                  to={link.path}
                  className="navbar-cat-item flex flex-shrink-0 items-center gap-1 border border-transparent px-3 py-2 text-sm font-medium text-white hover:border-white transition"
                >
                  {link.label}
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </Link>
                <div className="absolute top-full left-0 z-50 hidden min-w-max rounded shadow-xl group-hover:block" style={{ backgroundColor: "var(--modal-bg)", border: "1px solid var(--border-color)" }}>
                  {link.dropdown.map((item) => (
                    <Link
                      key={item.label}
                      to={item.sub
                        ? `${PATHS.PRODUCTS}?category=Clothing&subcategory=${item.sub}`
                        : `${PATHS.PRODUCTS}?category=Clothing`
                      }
                      className="block px-4 py-2 text-sm hover:opacity-80 transition"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.label}
                to={link.path}
                className="navbar-cat-item flex-shrink-0 border border-transparent px-3 py-2 text-sm font-medium text-white hover:border-white transition"
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
