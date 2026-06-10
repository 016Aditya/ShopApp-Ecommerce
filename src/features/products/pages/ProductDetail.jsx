import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";
import { useAuth } from "@/context/AuthContext";
import CartContext from "@/features/cart/context/CartContext";
import ReviewList from "@/features/reviews/components/ReviewList";
import { formatCurrency } from "@/utils/currency";
import PATHS from "@/routes/paths";
import { useContext } from "react";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);
  const { addToCart } = useContext(CartContext);
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="page product-detail-page">
        <div className="product-detail__skeleton">
          <div className="skeleton skeleton-heading" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page product-detail-page">
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => navigate(PATHS.PRODUCTS)}
        >
          ← Back to Products
        </button>
        <p className="error-text" role="alert">{error}</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="page product-detail-page">
      <button
        className="btn btn--ghost btn--sm"
        onClick={() => navigate(PATHS.PRODUCTS)}
      >
        ← Back to Products
      </button>

      <div className="product-detail">
        {/* ── Product info ──────────────────────────────────────────────── */}
        <div className="product-detail__info">
          <span className="product-card__category">{product.category}</span>
          <h1 className="product-detail__name">{product.name}</h1>
          <p className="product-detail__price">{formatCurrency(product.price)}</p>

          {product.description && (
            <p className="product-detail__description">{product.description}</p>
          )}

          <button
            className="btn btn--primary"
            onClick={() => addToCart(product.id, 1)}
          >
            Add to Cart
          </button>
        </div>

        {/* ── Reviews ──────────────────────────────────────────────────── */}
        <div className="product-detail__reviews">
          <ReviewList productId={id} currentUser={user ?? null} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
