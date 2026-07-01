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
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`${PATHS.PRODUCTS}?search=${encodeURIComponent(query.trim())}`);
  };
  const handleLogout = () => { logout(); navigate(PATHS.LOGIN); };
  const displayName = user?.firstName || user?.name || "User";

  return (
    <header className="sticky top-0 z-50 shadow-md" style={{ colorScheme: "dark" }}>

      {/* ══════════════ PRIMARY BAR ══════════════ */}
      {/*
        Height:   68px (up from 64px) — comfortable vertical rhythm
        Padding:  0 20px (up from 16px) — balanced side breathing room
        Logo:     minWidth 160px, padding-left 13px for spacious left margin
        Search:   flex:1 + marginRight:-10px reclaims ~10px from right side
        Gap:      12px between logo/search, 6px between right items
      */}
      <div style={{ backgroundColor: "var(--navbar-bg)", minHeight: "68px" }}>
        <div
          style={{
            maxWidth:    "1280px",
            margin:      "0 auto",
            padding:     "0 20px",
            height:      "68px",
            display:     "flex",
            alignItems:  "center",
            gap:         "12px",
          }}
        >

          {/* ── Logo — 160px wide, 7px extra left padding ── */}
          <Link
            to={PATHS.HOME}
            aria-label="ShopApp Home"
            style={{
              ...navItemBase,
              flexDirection: "column",
              alignItems:    "flex-start",
              // padding: top right bottom left
              // left: 6px base + 7px extra = 13px total
              padding:   "4px 8px 4px 13px",
              minWidth:  "150px",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
          >
            {/* Font bumped to 22px to fill the wider logo zone */}
            <span style={{ fontSize: "22px", fontWeight: 800, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.4px" }}>
              shop<span style={{ color: "var(--accent, #ff9f00)" }}>App</span>
            </span>
            <span style={{ fontSize: "10px", color: "#94a3b8", lineHeight: 1, marginTop: "2px", fontStyle: "italic" }}>
              .in
            </span>
          </Link>

          {/* ── Search — wider by ~10px via negative right margin ── */}
          {/*
            The right-side items use flexShrink:0, so extending the search form
            via a small negative marginRight is the cleanest way to grab the
            extra space without touching item widths.
          */}
          <form
            onSubmit={handleSearch}
            style={{ flex: 1, display: "flex", minWidth: 0, marginRight: "-10px" }}
          >
            <div
              style={{
                display:    "flex",
                width:      "100%",
                borderRadius: "2px",
                overflow:   "hidden",
                // Subtle orange glow on focus only
                boxShadow:  searchFocused ? "0 0 0 3px rgba(255,159,0,0.28)" : "none",
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
                style={{
                  flex:            1,
                  // padding reduced from 10px → 8px top/bottom = ~4px total height reduction
                  padding:         "8px 16px",
                  fontSize:        "14px",
                  outline:         "none",
                  border:          "none",
                  backgroundColor: "#fff",
                  color:           "#0f1111",
                  minWidth:        0,
                }}
              />
              <button
                type="submit"
                aria-label="Search"
                style={{
                  width:           "62px",
                  display:         "flex",
                  alignItems:      "center",
                  justifyContent:  "center",
                  backgroundColor: "var(--accent, #ff9f00)",
                  border:          "none",
                  cursor:          "pointer",
                  flexShrink:      0,
                  transition:      "opacity 0.15s",
                  // height is NOT set — it auto-matches the input height
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="#0f1111" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </div>
          </form>

          {/* ── Right nav — desktop only, gap 6px ── */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "5.5px", flexShrink: 0 }}>

            {/* Account */}
            {user ? (
              <div className="group" style={{ position: "relative" }}>
                <div
                  style={{
                    ...navItemBase,
                    flexDirection: "column",
                    alignItems:    "flex-start",
                    padding:       "4px 10.5px",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
                >
                  <span style={{ fontSize: "11.5px", color: "#cbd5e1", lineHeight: 1.4 }}>Hello, {displayName}</span>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>Account</span>
                </div>
                <div
                  className="group-hover:block hidden"
                  style={{
                    position:        "absolute",
                    top:             "100%",
                    right:           0,
                    minWidth:        "180px",
                    backgroundColor: "var(--modal-bg, #fff)",
                    border:          "1px solid var(--border-color, #ddd)",
                    borderRadius:    "4px",
                    boxShadow:       "0 4px 16px rgba(0,0,0,0.18)",
                    zIndex:          9999,
                  }}
                >
                  <Link to={PATHS.PROFILE}  style={{ display:"block", padding:"10px 16px", fontSize:"13px", color:"var(--text-primary)", textDecoration:"none" }} onMouseEnter={(e)=>e.currentTarget.style.background="var(--hover-bg,#f5f5f5)"} onMouseLeave={(e)=>e.currentTarget.style.background=""}>Profile</Link>
                  <Link to={PATHS.ORDERS}   style={{ display:"block", padding:"10px 16px", fontSize:"13px", color:"var(--text-primary)", textDecoration:"none" }} onMouseEnter={(e)=>e.currentTarget.style.background="var(--hover-bg,#f5f5f5)"} onMouseLeave={(e)=>e.currentTarget.style.background=""}>My Orders</Link>
                  <Link to={PATHS.WISHLIST} style={{ display:"block", padding:"10px 16px", fontSize:"13px", color:"var(--text-primary)", textDecoration:"none" }} onMouseEnter={(e)=>e.currentTarget.style.background="var(--hover-bg,#f5f5f5)"} onMouseLeave={(e)=>e.currentTarget.style.background=""}>
                    Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                  </Link>
                  <hr style={{ borderColor: "var(--border-color,#eee)", margin: 0 }} />
                  <button
                    onClick={handleLogout}
                    style={{ display:"block", width:"100%", textAlign:"left", padding:"10px 16px", fontSize:"13px", color:"var(--text-primary)", background:"none", border:"none", cursor:"pointer" }}
                    onMouseEnter={(e)=>e.currentTarget.style.background="var(--hover-bg,#f5f5f5)"}
                    onMouseLeave={(e)=>e.currentTarget.style.background=""}
                  >Sign Out</button>
                </div>
              </div>
            ) : (
              <Link
                to={PATHS.LOGIN}
                style={{ ...navItemBase, flexDirection:"column", alignItems:"flex-start", padding:"4px 10px" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
              >
                <span style={{ fontSize:"11px", color:"#cbd5e1", lineHeight:1.4 }}>Hello, sign in</span>
                <span style={{ fontSize:"14px", fontWeight:700, color:"#fff", lineHeight:1.4 }}>Account &amp; Lists</span>
              </Link>
            )}

            {/* Returns & Orders */}
            <Link
              to={PATHS.ORDERS}
              style={{ ...navItemBase, flexDirection:"column", alignItems:"flex-start", padding:"4px 10px" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
            >
              <span style={{ fontSize:"11px", color:"#cbd5e1", lineHeight:1.4 }}>Returns</span>
              <span style={{ fontSize:"14px", fontWeight:700, color:"#fff", lineHeight:1.4 }}>&amp; Orders</span>
            </Link>

            {/* Wishlist */}
            <Link
              to={PATHS.WISHLIST}
              aria-label="Wishlist"
              style={{ ...navItemBase, gap:"6px", padding:"4px 10px" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
            >
              <div style={{ position:"relative", display:"flex" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                  stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

            {/* Cart */}
            <Link
              to={PATHS.CART}
              aria-label="Cart"
              style={{ ...navItemBase, gap:"6px", padding:"4px 10px" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
            >
              <div style={{ position:"relative", display:"flex" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

            {/* Theme toggle — unchanged */}
            <ThemeToggle />
          </div>

          {/* ── Mobile: compact icons only ── */}
          <div className="flex md:hidden" style={{ alignItems:"center", gap:"4px", flexShrink:0 }}>
            {user ? (
              <Link to={PATHS.PROFILE} style={{ ...navItemBase, flexDirection:"column", alignItems:"flex-end" }}
                onMouseEnter={(e)=>e.currentTarget.style.borderColor="#fff"}
                onMouseLeave={(e)=>e.currentTarget.style.borderColor="transparent"}>
                <span style={{ fontSize:"9px", color:"#cbd5e1", lineHeight:1.4 }}>Hello, {displayName}</span>
                <span style={{ fontSize:"12px", fontWeight:700, color:"#fff", lineHeight:1.4 }}>Account</span>
              </Link>
            ) : (
              <Link to={PATHS.LOGIN} style={{ ...navItemBase }}
                onMouseEnter={(e)=>e.currentTarget.style.borderColor="#fff"}
                onMouseLeave={(e)=>e.currentTarget.style.borderColor="transparent"}>
                <span style={{ fontSize:"13px", fontWeight:700, color:"#fff" }}>Sign In</span>
              </Link>
            )}
            <Link to={PATHS.WISHLIST} aria-label="Wishlist" style={{ ...navItemBase, position:"relative" }}
              onMouseEnter={(e)=>e.currentTarget.style.borderColor="#fff"}
              onMouseLeave={(e)=>e.currentTarget.style.borderColor="transparent"}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {wishlistCount > 0 && (
                <span style={{ position:"absolute",top:"-4px",right:"-4px",minWidth:"16px",height:"16px",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"9999px",fontSize:"9px",fontWeight:800,backgroundColor:"var(--accent,#ff9f00)",color:"#0f1111",padding:"0 2px" }}>
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>
            <Link to={PATHS.CART} aria-label="Cart" style={{ ...navItemBase, position:"relative" }}
              onMouseEnter={(e)=>e.currentTarget.style.borderColor="#fff"}
              onMouseLeave={(e)=>e.currentTarget.style.borderColor="transparent"}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {totalItems > 0 && (
                <span style={{ position:"absolute",top:"-4px",right:"-4px",minWidth:"16px",height:"16px",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"9999px",fontSize:"9px",fontWeight:800,backgroundColor:"var(--accent,#ff9f00)",color:"#0f1111",padding:"0 2px" }}>
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
            <ThemeToggle />
          </div>

        </div>
      </div>

      {/* ══════════════ CATEGORY BAR ══════════════ */}
      {/* 'All' menu item removed per refinement spec */}
      <div style={{ backgroundColor: "var(--navbar-secondary-bg)" }}>
        <div
          className="container-app"
          style={{
            display:         "flex",
            alignItems:      "center",
            overflowX:       "auto",
            whiteSpace:      "nowrap",
            scrollbarWidth:  "none",
            msOverflowStyle: "none",
            gap:             0,
            minHeight:       "40px",
          }}
        >
          {NAV_LINKS.map((link) =>
            link.dropdown ? (
              <div key={link.label} className="group" style={{ position:"relative", flexShrink:0 }}>
                <Link
                  to={link.path}
                  style={{ display:"flex", alignItems:"center", gap:"4px", border:"1px solid transparent", padding:"8px 12px", fontSize:"15px", fontWeight:500, color:"#fff", textDecoration:"none", transition:"border-color 0.15s", borderRadius:"2px" }}
                  onMouseEnter={(e)=>e.currentTarget.style.borderColor="#fff"}
                  onMouseLeave={(e)=>e.currentTarget.style.borderColor="transparent"}
                >
                  {link.label}
                  <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </Link>
                <div
                  className="hidden group-hover:block"
                  style={{ position:"absolute", top:"100%", left:0, minWidth:"160px", backgroundColor:"var(--modal-bg,#fff)", border:"1px solid var(--border-color,#ddd)", borderRadius:"4px", boxShadow:"0 4px 16px rgba(0,0,0,0.18)", zIndex:9999 }}
                >
                  {link.dropdown.map((item) => (
                    <Link
                      key={item.label}
                      to={item.sub ? `${PATHS.PRODUCTS}?category=Clothing&subcategory=${item.sub}` : `${PATHS.PRODUCTS}?category=Clothing`}
                      style={{ display:"block", padding:"9px 16px", fontSize:"14px", color:"var(--text-primary)", textDecoration:"none" }}
                      onMouseEnter={(e)=>e.currentTarget.style.background="var(--hover-bg,#f5f5f5)"}
                      onMouseLeave={(e)=>e.currentTarget.style.background=""}
                    >{item.label}</Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.label}
                to={link.path}
                style={{ display:"flex", flexShrink:0, border:"1px solid transparent", padding:"8px 12px", fontSize:"15px", fontWeight:500, color:"#fff", textDecoration:"none", transition:"border-color 0.15s", borderRadius:"2px" }}
                onMouseEnter={(e)=>e.currentTarget.style.borderColor="#fff"}
                onMouseLeave={(e)=>e.currentTarget.style.borderColor="transparent"}
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
