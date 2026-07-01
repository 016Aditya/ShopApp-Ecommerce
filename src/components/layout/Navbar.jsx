import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import PATHS from "@/routes/paths";
import { useCartQuery } from "@/features/cart/hooks/useCart";
import { useWishlistQuery } from "@/features/wishlist/hooks/useWishlist";
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
  { label: "Today's Deals",    path: PATHS.PRODUCTS,  dropdown: null },
  { label: "Mobiles",          path: `${PATHS.PRODUCTS}?category=Electronics&subcategory=Mobile`, dropdown: null },
  { label: "Fashion",          path: `${PATHS.PRODUCTS}?category=Clothing`, dropdown: CLOTHING_SUBS },
  { label: "Electronics",      path: `${PATHS.PRODUCTS}?category=Electronics`, dropdown: null },
  { label: "Home & Kitchen",   path: `${PATHS.PRODUCTS}?category=Home`,        dropdown: null },
  { label: "Books",            path: `${PATHS.PRODUCTS}?category=Books`,        dropdown: null },
  { label: "Sports",           path: `${PATHS.PRODUCTS}?category=Sports`,       dropdown: null },
  { label: "New Releases",     path: PATHS.PRODUCTS,  dropdown: null },
  { label: "Customer Service", path: PATHS.CUSTOMER_SERVICE, dropdown: null },
];

// Mobile category chips with icons
const MOBILE_CATS = [
  {
    label: "Deals",
    path: PATHS.PRODUCTS,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    label: "Mobiles",
    path: `${PATHS.PRODUCTS}?category=Electronics&subcategory=Mobile`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
  },
  {
    label: "Fashion",
    path: `${PATHS.PRODUCTS}?category=Clothing`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
      </svg>
    ),
  },
  {
    label: "Electronics",
    path: `${PATHS.PRODUCTS}?category=Electronics`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    label: "Home & Kitchen",
    path: `${PATHS.PRODUCTS}?category=Home`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: "Books",
    path: `${PATHS.PRODUCTS}?category=Books`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    label: "Sports",
    path: `${PATHS.PRODUCTS}?category=Sports`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M4.93 4.93 19.07 19.07"/>
      </svg>
    ),
  },
];

// ── Shared nav-item hover wrapper ────────────────────────────────────────────
const navItemBase = {
  display:        "flex",
  flexShrink:     0,
  alignItems:     "center",
  borderRadius:   "2px",
  padding:        "4px 8px",
  cursor:         "pointer",
  border:         "1px solid transparent",
  transition:     "border-color 0.15s ease",
  textDecoration: "none",
};

function Navbar() {
  const { data: cartData }           = useCartQuery();
  const cartItems                    = cartData?.items ?? [];
  const totalItems                   = cartItems.reduce((sum, i) => sum + (i.quantity ?? 0), 0);
  const { data: wishlistItems = [] }  = useWishlistQuery();
  const wishlistCount                = wishlistItems.length;
  const { user, logout }             = useAuth();
  const navigate                     = useNavigate();
  const [query, setQuery]            = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`${PATHS.PRODUCTS}?search=${encodeURIComponent(query.trim())}`);
  };
  const handleLogout = () => { logout(); navigate(PATHS.LOGIN); };
  const displayName = user?.firstName || user?.name || "User";

  return (
    <header className="sticky top-0 z-50 shadow-md" style={{ colorScheme: "dark" }}>

      {/* ══════════════ DESKTOP PRIMARY BAR (hidden on mobile) ══════════════ */}
      <div className="hidden md:block" style={{ backgroundColor: "var(--navbar-bg)", minHeight: "68px" }}>
        <div
          style={{
            maxWidth:    "1282px",
            margin:      "0 auto",
            padding:     "0 19px",
            height:      "68px",
            display:     "flex",
            alignItems:  "center",
            gap:         "11px",
          }}
        >
          {/* ── Logo ── */}
          <Link
            to={PATHS.HOME}
            aria-label="ShopApp Home"
            style={{
              ...navItemBase,
              flexDirection: "column",
              alignItems:    "flex-start",
              padding:   "4px 7px 4px 13px",
              minWidth:  "150px",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
          >
            <span style={{ fontSize: "22.5px", fontWeight: 800, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.4px" }}>
              shop<span style={{ color: "var(--accent, #ff9f00)" }}>App</span>
            </span>
            <span style={{ fontSize: "10px", color: "#94a3b8", lineHeight: 1, marginTop: "2px", fontStyle: "italic" }}>
              .in
            </span>
          </Link>

          {/* ── Search ── */}
          <form onSubmit={handleSearch} style={{ flex: 1, display: "flex", minWidth: 0, marginRight: "-10px" }}>
            <div style={{ display:"flex", width:"100%", borderRadius:"2px", overflow:"hidden", border:"2px solid var(--accent, #ff9f00)", boxSizing:"border-box" }}>
              <input
                type="text"
                placeholder="Search products, brands and more..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ flex:1, padding:"8px 16px", fontSize:"14px", outline:"none", border:"none", backgroundColor:"#fff", color:"#0f1111", minWidth:0 }}
              />
              <button type="submit" aria-label="Search"
                style={{ width:"62px", display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"var(--accent, #ff9f00)", border:"none", cursor:"pointer", flexShrink:0, transition:"opacity 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f1111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </div>
          </form>

          {/* ── Right nav ── */}
          <div style={{ display:"flex", alignItems:"center", gap:"5.5px", flexShrink:0 }}>
            {user ? (
              <div className="group" style={{ position:"relative" }}>
                <div style={{ ...navItemBase, flexDirection:"column", alignItems:"flex-start", padding:"4px 11px" }}
                  onMouseEnter={(e)=>(e.currentTarget.style.borderColor="#fff")}
                  onMouseLeave={(e)=>(e.currentTarget.style.borderColor="transparent")}>
                  <span style={{ fontSize:"11.5px", color:"#cbd5e1", lineHeight:1.4 }}>Hello, {displayName}</span>
                  <span style={{ fontSize:"14px", fontWeight:700, color:"#fff", lineHeight:1.4 }}>Account</span>
                </div>
                <div className="group-hover:block hidden"
                  style={{ position:"absolute", top:"100%", right:0, minWidth:"180px", backgroundColor:"var(--modal-bg, #fff)", border:"1px solid var(--border-color, #ddd)", borderRadius:"4px", boxShadow:"0 4px 16px rgba(0,0,0,0.18)", zIndex:9999 }}>
                  <Link to={PATHS.PROFILE}  style={{ display:"block", padding:"10px 16px", fontSize:"14px", color:"var(--text-primary)", textDecoration:"none" }} onMouseEnter={(e)=>e.currentTarget.style.background="var(--hover-bg,#f5f5f5)"} onMouseLeave={(e)=>e.currentTarget.style.background=""}>Profile</Link>
                  <Link to={PATHS.ORDERS}   style={{ display:"block", padding:"10px 16px", fontSize:"14px", color:"var(--text-primary)", textDecoration:"none" }} onMouseEnter={(e)=>e.currentTarget.style.background="var(--hover-bg,#f5f5f5)"} onMouseLeave={(e)=>e.currentTarget.style.background=""}>My Orders</Link>
                  <Link to={PATHS.WISHLIST} style={{ display:"block", padding:"10px 16px", fontSize:"14px", color:"var(--text-primary)", textDecoration:"none" }} onMouseEnter={(e)=>e.currentTarget.style.background="var(--hover-bg,#f5f5f5)"} onMouseLeave={(e)=>e.currentTarget.style.background=""}>Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</Link>
                  <hr style={{ borderColor:"var(--border-color,#eee)", margin:0 }} />
                  <button onClick={handleLogout} style={{ display:"block", width:"100%", textAlign:"left", padding:"10px 16px", fontSize:"14px", color:"var(--text-primary)", background:"none", border:"none", cursor:"pointer" }} onMouseEnter={(e)=>e.currentTarget.style.background="var(--hover-bg,#f5f5f5)"} onMouseLeave={(e)=>e.currentTarget.style.background=""}>Sign Out</button>
                </div>
              </div>
            ) : (
              <Link to={PATHS.LOGIN} style={{ ...navItemBase, flexDirection:"column", alignItems:"flex-start", padding:"4px 10px" }}
                onMouseEnter={(e)=>(e.currentTarget.style.borderColor="#fff")}
                onMouseLeave={(e)=>(e.currentTarget.style.borderColor="transparent")}>
                <span style={{ fontSize:"11px", color:"#cbd5e1", lineHeight:1.4 }}>Hello, sign in</span>
                <span style={{ fontSize:"14px", fontWeight:700, color:"#fff", lineHeight:1.4 }}>Account &amp; Lists</span>
              </Link>
            )}
            <Link to={PATHS.ORDERS} style={{ ...navItemBase, flexDirection:"column", alignItems:"flex-start", padding:"4px 10px" }}
              onMouseEnter={(e)=>(e.currentTarget.style.borderColor="#fff")}
              onMouseLeave={(e)=>(e.currentTarget.style.borderColor="transparent")}>
              <span style={{ fontSize:"11px", color:"#cbd5e1", lineHeight:1.4 }}>Returns</span>
              <span style={{ fontSize:"14px", fontWeight:700, color:"#fff", lineHeight:1.4 }}>&amp; Orders</span>
            </Link>
            <Link to={PATHS.WISHLIST} aria-label="Wishlist" style={{ ...navItemBase, gap:"6px", padding:"4px 10px" }}
              onMouseEnter={(e)=>(e.currentTarget.style.borderColor="#fff")}
              onMouseLeave={(e)=>(e.currentTarget.style.borderColor="transparent")}>
              <div style={{ position:"relative", display:"flex" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                {wishlistCount > 0 && (
                  <span style={{ position:"absolute", top:"-5px", left:"14px", minWidth:"18px", height:"18px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"9999px", fontSize:"10px", fontWeight:800, backgroundColor:"var(--accent,#ff9f00)", color:"#0f1111", padding:"0 3px" }}>
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </div>
              <span style={{ fontSize:"14px", fontWeight:700, color:"#fff", marginBottom:"2px" }}>Wishlist</span>
            </Link>
            <Link to={PATHS.CART} aria-label="Cart" style={{ ...navItemBase, gap:"6px", padding:"4px 10px" }}
              onMouseEnter={(e)=>(e.currentTarget.style.borderColor="#fff")}
              onMouseLeave={(e)=>(e.currentTarget.style.borderColor="transparent")}>
              <div style={{ position:"relative", display:"flex" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                {totalItems > 0 && (
                  <span style={{ position:"absolute", top:"-5px", left:"14px", minWidth:"18px", height:"18px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"9999px", fontSize:"10px", fontWeight:800, backgroundColor:"var(--accent,#ff9f00)", color:"#0f1111", padding:"0 3px" }}>
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </div>
              <span style={{ fontSize:"14px", fontWeight:700, color:"#fff", marginBottom:"2px" }}>Cart</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* ══════════════ MOBILE NAVBAR ══════════════ */}
      <div className="md:hidden" style={{ backgroundColor: "var(--navbar-bg)" }}>

        {/* ── Row 1: Hamburger · Logo · Account · Cart · ThemeToggle ── */}
        <div style={{ display:"flex", alignItems:"center", padding:"10px 14px", gap:"10px" }}>

          {/* Hamburger */}
          <button
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background:"none", border:"none", cursor:"pointer", padding:"4px", flexShrink:0, display:"flex", alignItems:"center" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="6"  x2="21" y2="6"  />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Logo */}
          <Link to={PATHS.HOME} aria-label="ShopApp Home" style={{ textDecoration:"none", flexShrink:0 }}>
            <span style={{ fontSize:"20px", fontWeight:800, color:"#fff", letterSpacing:"-0.3px" }}>
              shop<span style={{ color:"var(--accent, #ff9f00)" }}>App</span>
            </span>
            <span style={{ fontSize:"11px", color:"#94a3b8", fontStyle:"italic", marginLeft:"1px" }}>.in</span>
          </Link>

          {/* Spacer */}
          <div style={{ flex:1 }} />

          {/* Account / User */}
          {user ? (
            <Link to={PATHS.PROFILE} style={{ display:"flex", alignItems:"center", gap:"4px", textDecoration:"none", flexShrink:0 }}>
              <span style={{ fontSize:"13px", fontWeight:600, color:"#fff" }}>{displayName}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
          ) : (
            <Link to={PATHS.LOGIN} style={{ textDecoration:"none", flexShrink:0 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
          )}

          {/* Cart */}
          <Link to={PATHS.CART} aria-label="Cart" style={{ position:"relative", display:"flex", alignItems:"center", textDecoration:"none", flexShrink:0 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            {totalItems > 0 && (
              <span style={{ position:"absolute", top:"-6px", right:"-6px", minWidth:"18px", height:"18px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"9999px", fontSize:"10px", fontWeight:800, backgroundColor:"var(--accent,#ff9f00)", color:"#0f1111", padding:"0 3px" }}>
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>

        {/* ── Row 2: Full-width Search Bar ── */}
        <div style={{ padding:"0 14px 10px" }}>
          <form onSubmit={handleSearch}>
            <div style={{ display:"flex", borderRadius:"8px", overflow:"hidden", border:"2px solid var(--accent, #ff9f00)", boxSizing:"border-box" }}>
              <input
                type="text"
                placeholder="Search products, brands and more..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ flex:1, padding:"10px 14px", fontSize:"14px", outline:"none", border:"none", backgroundColor:"var(--input-bg, #2a2a2a)", color:"var(--text-primary, #fff)", minWidth:0 }}
              />
              <button type="submit" aria-label="Search"
                style={{ width:"52px", display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"var(--accent, #ff9f00)", border:"none", cursor:"pointer", flexShrink:0, borderRadius:"0 6px 6px 0" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f1111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* ── Row 3: Shop By + Category Chips ── */}
        <div style={{ backgroundColor:"color-mix(in srgb, var(--navbar-bg) 93%, white 7%)", paddingBottom:"6px" }}>
          <div style={{ padding:"8px 14px 4px", fontSize:"12px", fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.5px" }}>
            Shop By
          </div>
          <div style={{ display:"flex", gap:"0", overflowX:"auto", scrollbarWidth:"none", msOverflowStyle:"none", paddingBottom:"6px" }}>
            {MOBILE_CATS.map((cat) => (
              <Link
                key={cat.label}
                to={cat.path}
                style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0, padding:"6px 14px", gap:"4px", textDecoration:"none", color:"#fff" }}
              >
                <span style={{ color:"#fff", opacity:0.85 }}>{cat.icon}</span>
                <span style={{ fontSize:"11px", fontWeight:500, whiteSpace:"nowrap", color:"#e2e8f0" }}>{cat.label}</span>
              </Link>
            ))}
            {/* More button */}
            <Link
              to={PATHS.PRODUCTS}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0, padding:"6px 14px", gap:"4px", textDecoration:"none", color:"#fff" }}
            >
              <span style={{ color:"#fff", opacity:0.85 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="5"  cy="12" r="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <circle cx="19" cy="12" r="2"/>
                </svg>
              </span>
              <span style={{ fontSize:"11px", fontWeight:500, color:"#e2e8f0" }}>More</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile Slide-out Drawer ── */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.55)", zIndex:998 }}
          />
          {/* Drawer */}
          <div
            style={{ position:"fixed", top:0, left:0, width:"78vw", maxWidth:"300px", height:"100dvh", backgroundColor:"var(--modal-bg, #1c1c1c)", zIndex:999, overflowY:"auto", padding:"0 0 24px" }}
          >
            {/* Drawer header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 16px", backgroundColor:"var(--navbar-bg)", marginBottom:"8px" }}>
              <span style={{ fontSize:"16px", fontWeight:700, color:"#fff" }}>
                {user ? `Hello, ${displayName}` : "Hello, Sign In"}
              </span>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu"
                style={{ background:"none", border:"none", cursor:"pointer", color:"#fff", display:"flex" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Drawer links */}
            {[
              { label:"Home",           path: PATHS.HOME },
              { label:"My Orders",      path: PATHS.ORDERS },
              { label:"Profile",        path: PATHS.PROFILE },
              { label:"Wishlist",       path: PATHS.WISHLIST },
              { label:"Cart",           path: PATHS.CART },
              { label:"Today's Deals",  path: PATHS.PRODUCTS },
              { label:"Electronics",    path: `${PATHS.PRODUCTS}?category=Electronics` },
              { label:"Fashion",        path: `${PATHS.PRODUCTS}?category=Clothing` },
              { label:"Home & Kitchen", path: `${PATHS.PRODUCTS}?category=Home` },
              { label:"Books",          path: `${PATHS.PRODUCTS}?category=Books` },
              { label:"Sports",         path: `${PATHS.PRODUCTS}?category=Sports` },
              { label:"Customer Service", path: PATHS.CUSTOMER_SERVICE },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{ display:"block", padding:"13px 20px", fontSize:"15px", color:"var(--text-primary, #e2e8f0)", textDecoration:"none", borderBottom:"1px solid var(--border-color, rgba(255,255,255,0.07))" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--hover-bg, rgba(255,255,255,0.06))"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
              >{item.label}</Link>
            ))}

            {user && (
              <>
                <hr style={{ borderColor:"var(--border-color, rgba(255,255,255,0.1))", margin:"8px 0" }} />
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  style={{ display:"block", width:"100%", textAlign:"left", padding:"13px 20px", fontSize:"15px", color:"#f87171", background:"none", border:"none", cursor:"pointer" }}
                >Sign Out</button>
              </>
            )}
          </div>
        </>
      )}

      {/* ══════════════ DESKTOP CATEGORY BAR (hidden on mobile) ══════════════ */}
      <div className="hidden md:block" style={{ backgroundColor: "color-mix(in srgb, var(--navbar-bg) 93%, white 6%)" }}>
        <div
          className="container-app"
          style={{ display:"flex", alignItems:"center", overflowX:"auto", whiteSpace:"nowrap", scrollbarWidth:"none", msOverflowStyle:"none", gap:0, minHeight:"40px" }}
        >
          <Link
            to={PATHS.PRODUCTS}
            style={{ display:"flex", flexShrink:0, alignItems:"center", gap:"6px", border:"1px solid transparent", padding:"8px 12px", fontSize:"14px", fontWeight:700, color:"#fff", textDecoration:"none", transition:"border-color 0.15s", borderRadius:"2px" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
          >
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5h14a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm0 4h14a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm0 4h14a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2z" clipRule="evenodd" />
            </svg>
            All
          </Link>

          {NAV_LINKS.map((link) =>
            link.dropdown ? (
              <div key={link.label} className="group" style={{ position:"relative", flexShrink:0 }}>
                <Link to={link.path}
                  style={{ display:"flex", alignItems:"center", gap:"4px", border:"1px solid transparent", padding:"8px 12px", fontSize:"14.5px", fontWeight:500, color:"#fff", textDecoration:"none", transition:"border-color 0.15s", borderRadius:"2px" }}
                  onMouseEnter={(e)=>e.currentTarget.style.borderColor="#fff"}
                  onMouseLeave={(e)=>e.currentTarget.style.borderColor="transparent"}
                >
                  {link.label}
                  <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </Link>
                <div className="hidden group-hover:block"
                  style={{ position:"absolute", top:"100%", left:0, minWidth:"160px", backgroundColor:"var(--modal-bg,#fff)", border:"1px solid var(--border-color,#ddd)", borderRadius:"4px", boxShadow:"0 4px 16px rgba(0,0,0,0.18)", zIndex:9999 }}>
                  {link.dropdown.map((item) => (
                    <Link key={item.label}
                      to={item.sub ? `${PATHS.PRODUCTS}?category=Clothing&subcategory=${item.sub}` : `${PATHS.PRODUCTS}?category=Clothing`}
                      style={{ display:"block", padding:"9px 16px", fontSize:"14px", color:"var(--text-primary)", textDecoration:"none" }}
                      onMouseEnter={(e)=>e.currentTarget.style.background="var(--hover-bg,#f5f5f5)"}
                      onMouseLeave={(e)=>e.currentTarget.style.background=""}>{item.label}</Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={link.label} to={link.path}
                style={{ display:"flex", flexShrink:0, border:"1px solid transparent", padding:"8px 12px", fontSize:"14.5px", fontWeight:500, color:"#fff", textDecoration:"none", transition:"border-color 0.15s", borderRadius:"2px" }}
                onMouseEnter={(e)=>e.currentTarget.style.borderColor="#fff"}
                onMouseLeave={(e)=>e.currentTarget.style.borderColor="transparent"}
              >{link.label}</Link>
            )
          )}
        </div>
      </div>

    </header>
  );
}

export default Navbar;
