import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";
import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/store";
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

  // Snap to top on every product navigation.
  // React Router preserves scroll depth across client-side navigations —
  // without this, clicking a Similar Product card while scrolled down
  // would open the new product already scrolled to the reviews section.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { product, loading, error } = useProduct(id);
  const { user } = useAuth();
  const [toast, setToast] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = async () => {
    if (!user) { navigate(PATHS.LOGIN); return; }
    setAddingToCart(true);
    try {
      await useCartStore.getState().addToCart(product, 1);
      showToast("Added to cart! 🛒");
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
      await useCartStore.getState().addToCart(product, 1);
      navigate(PATHS.CART);
    } catch {
      showToast("Failed. Please try again.", "error");
    } finally {
      setBuyingNow(false);
    }
  };

  if (loading) return <ProductDetailSkeleton />;

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
