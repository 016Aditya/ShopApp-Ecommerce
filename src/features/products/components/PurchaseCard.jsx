import { useState } from "react";
import { formatCurrency } from "@/utils/currency";
import "../styles/ProductDetail.css";

/**
 * PurchaseCard — sticky right column.
 * Shows price, delivery, qty selector, Add to Cart + Buy Now.
 */
const PurchaseCard = ({ product, onAddToCart, onBuyNow }) => {
  const [qty, setQty] = useState(1);

  const inStock = product.inStock !== false;

  return (
    <div className="pdp-purchase">
      {/* Price */}
      <div className="pdp-purchase__price">{formatCurrency(product.price)}</div>

      {/* Delivery */}
      <div className="pdp-purchase__delivery">
        <span className="pdp-purchase__label">FREE Delivery</span>
        <span>on orders over ₹499</span>
      </div>

      {/* Availability */}
      <div className={`pdp-purchase__avail ${inStock ? "pdp-purchase__avail--in" : "pdp-purchase__avail--out"}`}>
        {inStock ? "In Stock" : "Currently Unavailable"}
      </div>

      {inStock && (
        <>
          {/* Qty selector */}
          <div className="pdp-purchase__qty">
            <label htmlFor="pdp-qty" className="pdp-purchase__label">Qty:</label>
            <select
              id="pdp-qty"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="pdp-purchase__qty-select"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <button
            className="btn pdp-purchase__btn pdp-purchase__btn--cart"
            onClick={onAddToCart}
          >
            Add to Cart
          </button>
          <button
            className="btn pdp-purchase__btn pdp-purchase__btn--buy"
            onClick={onBuyNow}
          >
            Buy Now
          </button>
        </>
      )}

      {/* Secure transaction */}
      <p className="pdp-purchase__secure">🔒 Secure transaction</p>

      {/* Sold by */}
      <div className="pdp-purchase__meta">
        <span className="pdp-purchase__label">Sold by</span>
        <span>ShopApp India</span>
      </div>
    </div>
  );
};

export default PurchaseCard;
