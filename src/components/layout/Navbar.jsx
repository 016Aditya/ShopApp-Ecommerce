import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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

// ── 5 primary mobile categories (visible in grid) ────────────────────────────
const MOBILE_PRIMARY = [
  {
    label: "Deals",
    path: PATHS.PRODUCTS,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    label: "Mobiles",
    path: `${PATHS.PRODUCTS}?category=Electronics&subcategory=Mobile`,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
  },
  {
    label: "Fashion",
    path: `${PATHS.PRODUCTS}?category=Clothing`,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
      </svg>
    ),
  },
  {
    label: "Electronics",
    path: `${PATHS.PRODUCTS}?category=Electronics`,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    label: "Home &\nKitchen",
    path: `${PATHS.PRODUCTS}?category=Home`,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
];

// ── All categories shown in the "More" bottom sheet ───────────────────────────
const MORE_CATS = [
  { label: "All Products",     path: PATHS.PRODUCTS,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: "Today's Deals",    path: PATHS.PRODUCTS,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  { label: "Books",            path: `${PATHS.PRODUCTS}?category=Books`,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
  { label: "Sports",           path: `${PATHS.PRODUCTS}?category=Sports`,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93 19.07 19.07"/></svg> },
  { label: "New Releases",     path: PATHS.PRODUCTS,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { label: "Customer Service", path: PATHS.CUSTOMER_SERVICE,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.26h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l1.06-1.06a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
  { label: "Grocery",          path: `${PATHS.PRODUCTS}?category=Grocery`,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
  { label: "Beauty",           path: `${PATHS.PRODUCTS}?category=Beauty`,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { label: "Appliances",       path: `${PATHS.PRODUCTS}?category=Appliances`,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
  { label: "Furniture",        path: `${PATHS.PRODUCTS}?category=Furniture`,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"/><path d="M4 18v2M20 18v2M12 4v9"/></svg> },
  { label: "Gaming",           path: `${PATHS.PRODUCTS}?category=Gaming`,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="13" r="1" fill="currentColor"/><circle cx="17" cy="11" r="1" fill="currentColor"/><path d="M17.92 10A10 10 0 0 0 12 8c-5.5 0-10 4-10 9s2 5 4 5 2.5-2 6-2 4.5 2 6 2 4-1 4-5a10 10 0 0 0-.08-1"/></svg> },
  { label: "Automotive",       path: `${PATHS.PRODUCTS}?category=Automotive`,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg> },
  { label: "Health",           path: `${PATHS.PRODUCTS}?category=Health`,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
  { label: "Accessories",      path: `${PATHS.PRODUCTS}?category=Accessories`,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg> },
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
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);

  // Animate bottom sheet in/out
  useEffect(() => {
    if (bottomSheetOpen) {
      requestAnimationFrame(() => setSheetVisible(true));
    } else {
      setSheetVisible(false);
    }
  }, [bottomSheetOpen]);

  const closeBottomSheet = () => {
    setSheetVisible(false);
    setTimeout(() => setBottomSheetOpen(false), 280);
  };

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
                  <Link to={PATHS.PROFILE}  style={{ display:"block", padding:"10px 16px", fontSize:"13px", color:"var(--text-primary)", textDecoration:"none" }} onMouseEnter={(e)=>e.currentTarget.style.background="var(--hover-bg,#f5f5f5)"} onMouseLeave={(e)=>e.currentTarget.style.background=""}>Profile</Link>
                  <Link to={PATHS.ORDERS}   style={{ display:"block", padding:"10px 16px", fontSize:"13px", color:"var(--text-primary)", textDecoration:"none" }} onMouseEnter={(e)=>e.currentTarget.style.background="var(--hover-bg,#f5f5f5)"} onMouseLeave={(e)=>e.currentTarget.style.background=""}>My Orders</Link>
                  <Link to={PATHS.WISHLIST} style={{ display:"block", padding:"10px 16px", fontSize:"13px", color:"var(--text-primary)", textDecoration:"none" }} onMouseEnter={(e)=>e.currentTarget.style.background="var(--hover-bg,#f5f5f5)"} onMouseLeave={(e)=>e.currentTarget.style.background=""}>Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</Link>
                  <hr style={{ borderColor:"var(--border-color,#eee)", margin:0 }} />
                  <button onClick={handleLogout} style={{ display:"block", width:"100%", textAlign:"left", padding:"10px 16px", fontSize:"13px", color:"var(--text-primary)", background:"none", border:"none", cursor:"pointer" }} onMouseEnter={(e)=>e.currentTarget.style.background="var(--hover-bg,#f5f5f5)"} onMouseLeave={(e)=>e.currentTarget.style.background=""}>Sign Out</button>
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

          <Link to={PATHS.HOME} aria-label="ShopApp Home" style={{ textDecoration:"none", flexShrink:0 }}>
            <span style={{ fontSize:"20px", fontWeight:800, color:"#fff", letterSpacing:"-0.3px" }}>
              shop<span style={{ color:"var(--accent, #ff9f00)" }}>App</span>
            </span>
            <span style={{ fontSize:"11px", color:"#94a3b8", fontStyle:"italic", marginLeft:"1px" }}>.in</span>
          </Link>

          <div style={{ flex:1 }} />

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

          <ThemeToggle />
        </div>

        {/* ── Row 2: Search Bar ── */}
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

        {/* ══ Row 3: Shop By — Premium 6-column CSS Grid ══ */}
        <div style={{
          backgroundColor: "color-mix(in srgb, var(--navbar-bg) 92%, white 8%)",
          padding: "16px 18px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          {/* Heading */}
          <p style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#B8C0CC",
            letterSpacing: "0.3px",
            marginBottom: "16px",
            lineHeight: 1,
          }}>Shop By</p>

          {/* 6-column equal grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "0",
          }}>
            {/* Primary 5 cats */}
            {MOBILE_PRIMARY.map((cat) => (
              <Link
                key={cat.label}
                to={cat.path}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "8px",
                  textDecoration: "none",
                  padding: "4px 2px",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <span style={{ color: "#e2e8f0", display: "flex", flexShrink: 0 }}>{cat.icon}</span>
                <span style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#d1d5db",
                  textAlign: "center",
                  lineHeight: 1.3,
                  whiteSpace: cat.label.includes("\n") ? "pre-line" : "nowrap",
                  wordBreak: "break-word",
                }}>{cat.label}</span>
              </Link>
            ))}

            {/* More button — 6th column */}
            <button
              onClick={() => setBottomSheetOpen(true)}
              aria-label="More categories"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 2px",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <span style={{ color: "#e2e8f0", display: "flex" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="5"  cy="12" r="2.2"/>
                  <circle cx="12" cy="12" r="2.2"/>
                  <circle cx="19" cy="12" r="2.2"/>
                </svg>
              </span>
              <span style={{ fontSize: "11px", fontWeight: 500, color: "#d1d5db", whiteSpace: "nowrap" }}>More</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════ MOBILE HAMBURGER DRAWER ══════════════ */}
      {mobileMenuOpen && (
        <>
          <div onClick={() => setMobileMenuOpen(false)}
            style={{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.55)", zIndex:998 }} />
          <div style={{ position:"fixed", top:0, left:0, width:"78vw", maxWidth:"300px", height:"100dvh", backgroundColor:"var(--modal-bg, #1c1c1c)", zIndex:999, overflowY:"auto", padding:"0 0 24px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px", backgroundColor:"var(--navbar-bg)", marginBottom:"8px" }}>
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
              <Link key={item.label} to={item.path} onClick={() => setMobileMenuOpen(false)}
                style={{ display:"block", padding:"13px 20px", fontSize:"15px", color:"var(--text-primary, #e2e8f0)", textDecoration:"none", borderBottom:"1px solid var(--border-color, rgba(255,255,255,0.07))" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--hover-bg, rgba(255,255,255,0.06))"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}>{item.label}</Link>
            ))}
            {user && (
              <>
                <hr style={{ borderColor:"var(--border-color, rgba(255,255,255,0.1))", margin:"8px 0" }} />
                <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  style={{ display:"block", width:"100%", textAlign:"left", padding:"13px 20px", fontSize:"15px", color:"#f87171", background:"none", border:"none", cursor:"pointer" }}>Sign Out</button>
              </>
            )}
          </div>
        </>
      )}

      {/* ══════════════ MORE — BOTTOM SHEET ══════════════ */}
      {bottomSheetOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeBottomSheet}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              zIndex: 1000,
              transition: "opacity 250ms ease",
              opacity: sheetVisible ? 1 : 0,
            }}
          />
          {/* Sheet */}
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "var(--modal-bg, #1e1e1e)",
              borderRadius: "22px 22px 0 0",
              zIndex: 1001,
              maxHeight: "80dvh",
              overflowY: "auto",
              transform: sheetVisible ? "translateY(0)" : "translateY(100%)",
              transition: "transform 260ms cubic-bezier(0.32,0.72,0,1)",
              paddingBottom: "env(safe-area-inset-bottom, 16px)",
            }}
          >
            {/* Handle */}
            <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 4px" }}>
              <div style={{ width:"40px", height:"4px", borderRadius:"9999px", backgroundColor:"rgba(255,255,255,0.18)" }} />
            </div>

            {/* Header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 20px 16px" }}>
              <span style={{ fontSize:"16px", fontWeight:700, color:"#fff" }}>All Categories</span>
              <button onClick={closeBottomSheet} aria-label="Close"
                style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8", display:"flex", padding:"4px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Categories grid inside sheet — 4 columns */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "4px",
              padding: "0 12px 24px",
            }}>
              {MORE_CATS.map((cat) => (
                <Link
                  key={cat.label}
                  to={cat.path}
                  onClick={closeBottomSheet}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 8px",
                    textDecoration: "none",
                    borderRadius: "12px",
                    backgroundColor: "rgba(255,255,255,0.04)",
                    transition: "background 0.15s",
                  }}
                  onTouchStart={(e) => e.currentTarget.style.backgroundColor = "rgba(255,159,0,0.12)"}
                  onTouchEnd={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)"}
                >
                  <span style={{ color: "#e2e8f0" }}>{cat.icon}</span>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "#cbd5e1",
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}>{cat.label}</span>
                </Link>
              ))}
            </div>
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
