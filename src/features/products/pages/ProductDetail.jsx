import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";
import { useAuth } from "@/context/AuthContext";
import CartContext from "@/features/cart/context/CartContext";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductInfo from "../components/ProductInfo";
import PurchaseCard from "../components/PurchaseCard";
import ReviewList from "@/features/reviews/components/ReviewList";
import PATHS from "@/routes/paths";
import "../styles/ProductDetail.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);
  const { addToCart } = useContext(CartContext);
  const { user } = useAuth();
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate(PATHS.LOGIN);
      return;
    }
    try {
      await addToCart(product.id, 1);
      showToast("Added to cart!");
    } catch {
      showToast("Failed to add to cart.", "error");
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate(PATHS.LOGIN);
      return;
    }
    try {
      await addToCart(product.id, 1);
      navigate(PATHS.CART);
    } catch {
      showToast("Failed. Please try again.", "error");
    }
  };

  /* ── Loading skeleton ─────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="pdp-page">
        <div className="pdp-skeleton">
          <div className="pdp-skeleton__img skeleton" />
          <div className="pdp-skeleton__info">
            <div className="skeleton skeleton-heading" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text" style={{ width: "60%" }} />
            <div className="skeleton skeleton-text" style={{ width: "40%" }} />
          </div>
          <div className="pdp-skeleton__card skeleton" />
        </div>
      </div>
    );
  }

  /* ── Error state ──────────────────────────────────────────────────── */
  if (error) {
    return (
      <div className="pdp-page">
        <button className="pdp-back" onClick={() => navigate(PATHS.PRODUCTS)}>
          ← Back to Products
        </button>
        <div className="pdp-error">
          <span className="pdp-error__icon">⚠️</span>
          <p>{error}</p>
          <button className="btn btn--primary" onClick={() => navigate(PATHS.PRODUCTS)}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="pdp-page">
      {/* Back link */}
      <button className="pdp-back" onClick={() => navigate(PATHS.PRODUCTS)}>
        ← Back to Products
      </button>

      {/* Breadcrumb */}
      <nav className="pdp-breadcrumb" aria-label="breadcrumb">
        <span>Home</span>
        <span className="pdp-breadcrumb__sep">›</span>
        <span>{product.category}</span>
        {product.subcategory && (
          <>
            <span className="pdp-breadcrumb__sep">›</span>
            <span>{product.subcategory}</span>
          </>
        )}
        <span className="pdp-breadcrumb__sep">›</span>
        <span className="pdp-breadcrumb__current">{product.name}</span>
      </nav>

      {/* 3-column layout */}
      <div className="pdp-grid">
        {/* LEFT — Image Gallery */}
        <div className="pdp-grid__images">
          <ProductImageGallery imageUrl={product.imageUrl} name={product.name} />
        </div>

        {/* CENTER — Product Info */}
        <div className="pdp-grid__info">
          <ProductInfo product={product} />
        </div>

        {/* RIGHT — Purchase Card */}
        <div className="pdp-grid__card">
          <PurchaseCard
            product={product}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </div>
      </div>

      {/* Reviews */}
      <div className="pdp-reviews">
        <ReviewList productId={id} currentUser={user ?? null} />
      </div>

      {/* Toast */}
      {toast && (
        <div className={`pdp-toast pdp-toast--${toast.type}`} role="alert">
          {toast.type === "success" ? "✓" : "✗"} {toast.msg}
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
