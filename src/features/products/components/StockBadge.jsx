/**
 * StockBadge — shows In Stock / Only N left / Out of Stock
 * Use on: ProductCard, ProductInfo, CartItem, CheckoutItems, WishlistItem
 */
const StockBadge = ({ inStock, stock, lowStockThreshold = 5, className = '' }) => {
  const baseClasses = "inline-block px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide";
  const variants = {
    in: "bg-green-100 text-green-800",
    low: "bg-amber-100 text-amber-900",
    out: "bg-red-100 text-red-800",
  };

  if (inStock === false || stock === 0) {
    return <span className={`${baseClasses} ${variants.out} ${className}`} aria-label="Out of stock">Out of Stock</span>;
  }

  if (typeof stock === 'number' && stock > 0 && stock <= lowStockThreshold) {
    return <span className={`${baseClasses} ${variants.low} ${className}`} aria-label={`Only ${stock} items left`}>Only {stock} left</span>;
  }

  return <span className={`${baseClasses} ${variants.in} ${className}`} aria-label="In stock">In Stock</span>;
};

export default StockBadge;