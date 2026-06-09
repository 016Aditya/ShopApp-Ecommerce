import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import PATHS, { buildPath } from "@/routes/paths";
import CartContext from "@/features/cart/context/CartContext";
import { formatCurrency } from "@/utils/currency";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.stopPropagation(); // don't navigate on button click
    addToCart(product.id, 1);
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id))}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id))}
    >
      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__price">{formatCurrency(product.price)}</p>
      </div>

      <div className="product-card__footer">
        <button
          className="btn btn--primary btn--sm"
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;