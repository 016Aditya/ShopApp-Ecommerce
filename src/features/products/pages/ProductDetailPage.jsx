import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAddToCart } from "@/features/cart/hooks/useCart";
import {
  useWishlistQuery,
  useAddToWishlist,
  useRemoveFromWishlist,
} from "@/features/wishlist/hooks/useWishlist";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductInfo from "../components/ProductInfo";
import PurchaseCard from "../components/PurchaseCard";
import ReviewList from "@/features/reviews/components/ReviewList";
import SimilarProducts from "../components/SimilarProducts";
import { ProductDetailSkeleton } from "@/components/skeleton";
import PATHS from "@/routes/paths";
import "../styles/ProductDetail.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Snap viewport to top on every product navigation.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { product, loading, error } = useProduct(id);
  const { user } = useAuth();

  // TanStack Query mutation — replaces useCartStore.getState().addToCart()
  const addToCartMutation = useAddToCart();

  // ── Wishlist ────────────────────────────────────────────────
  const { data: wishlistItems = [] } = useWishlistQuery();
  const addToWishlistMutation    = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const isWishlisted = wishlistItems.some(
    (item) => String(item.productId) === String(id)
  );
  const [wishBusy, setWishBusy] = useState(false);

  const handleWishlistToggle = async () => {
    if (!user) { navigate(PATHS.LOGIN); return; }
    setWishBusy(true);
    try {
      if (isWishlisted) {
        await removeFromWishlistMutation.mutateAsync({ productId: id });
      } else {
        await addToWishlistMutation.mutateAsync({ productId: id });
      }
    } finally {
      setWishBusy(false);
    }
  };

  const [toast, setToast]               = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow]       = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = async () => {
    if (!user) { navigate(PATHS.LOGIN); return; }
    setAddingToCart(true);
    try {
      await addToCartMutation.mutateAsync({ product, quantity: 1 });
      showToast("Added to cart! \uD83D\uDED2");
    } catch {
      showToast("Failed to add to cart.", "error");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) { navigate(PATHS.LOGIN); return; }
    setBuyingNow(true);
    try {
      await addToCartMutation.mutateAsync({ product, quantity: 1 });
      navigate(PATHS.CART);
    } catch {
      showToast("Failed. Please try again.", "error");
    } finally {
      setBuyingNow(false);
    }
  };

  // ── ID mismatch guard ────────────────────────────────────────────
  // Guards against stale cache race conditions during concurrent-mode renders.
  const idMismatch = product && String(product.id) !== String(id);

  if (loading || idMismatch) return <ProductDetailSkeleton />;

  if (error) {
    return (
      <div className="pdp-page">
        <button className="pdp-back" onClick={() => navigate(PATHS.PRODUCTS)}>← Back to Products</button>
        <div className="pdp-error">
          <span className="pdp-error__icon">⚠️</span>
          <p>{error}</p>
          <button className="btn btn--primary" onClick={() => navigate(PATHS.PRODUCTS)}>Browse Products</button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="pdp-page sk-loaded">
      <button className="pdp-back" onClick={() => navigate(PATHS.PRODUCTS)}>← Back to Products</button>

      <nav className="pdp-breadcrumb" aria-label="breadcrumb">
        <span>Home</span>
        <span className="pdp-breadcrumb__sep">›</span>
        <span>{product.category}</span>
        {product.subcategory && (
          <><span className="pdp-breadcrumb__sep">›</span><span>{product.subcategory}</span></>
        )}
        <span className="pdp-breadcrumb__sep">›</span>
        <span className="pdp-breadcrumb__current">{product.name}</span>
      </nav>

      {/* Wishlist heart button — above the gallery grid */}
      <button
        className={`pdp-wish-btn${isWishlisted ? ' pdp-wish-btn--active' : ''}`}
        onClick={handleWishlistToggle}
        disabled={wishBusy}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <svg viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {isWishlisted ? 'Wishlisted' : 'Wishlist'}
      </button>

      <div className="pdp-grid">
        <div className="pdp-grid__images">
          <ProductImageGallery imageUrl={product.imageUrl} name={product.name} />
        </div>
        <div className="pdp-grid__info">
          <ProductInfo product={product} />
        </div>
        <div className="pdp-grid__card">
          <PurchaseCard
            product={product}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            addingToCart={addingToCart}
            buyingNow={buyingNow}
          />
        </div>
      </div>

      {product.category && (
        <SimilarProducts
          category={product.category}
          currentProductId={product.id}
        />
      )}

      <div className="pdp-reviews">
        <ReviewList productId={id} currentUser={user ?? null} />
      </div>

      {toast && (
        <div className={`pdp-toast pdp-toast--${toast.type}`} role="alert">
          {toast.type === "success" ? "✓" : "✗"} {toast.msg}
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
