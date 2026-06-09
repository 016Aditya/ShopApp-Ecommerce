import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useProduct } from "../hooks/useProducts";
import CartContext from "@/features/cart/context/CartContext";
import { formatCurrency } from "@/utils/currency";
import PATHS from "@/routes/paths";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);
  const { addToCart } = useContext(CartContext);

  if (loading) return <p className="loading-text">Loading product...</p>;
  if (error)   return <p className="error-text">{error}</p>;
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
        <div className="product-detail__info">
          <span className="product-card__category">{product.category}</span>
          <h1 className="product-detail__name">{product.name}</h1>
          <p className="product-detail__price">{formatCurrency(product.price)}</p>

          <button
            className="btn btn--primary"
            onClick={() => addToCart(product.id, 1)}
          >
            Add to Cart
          </button>
        </div>

        {/* Reviews will be injected here in Step 8 */}
        <div className="product-detail__reviews" id="reviews-section" />
      </div>
    </div>
  );
};

export default ProductDetailPage;