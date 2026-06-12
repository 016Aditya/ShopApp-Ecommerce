import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProductsByCategory } from "@/services/productService";
import PATHS from "@/routes/paths";
import "../styles/SimilarProducts.css";

const SimilarProducts = ({ category, currentProductId }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    getProductsByCategory(category)
      .then((data) => {
        const filtered = data.filter((p) => p.id !== currentProductId);
        setProducts(filtered.slice(0, 12));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, currentProductId]);

  if (!loading && products.length === 0) return null;

  const formatPrice = (p) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(p);

  const discount = (original, current) =>
    original > current ? Math.round(((original - current) / original) * 100) : null;

  return (
    <section className="similar-products" aria-label="Similar Products">
      <div className="similar-products__header">
        <h2 className="similar-products__title">Similar Products</h2>
        <button
          className="similar-products__view-all"
          onClick={() =>
            navigate(`${PATHS.PRODUCTS}?category=${encodeURIComponent(category)}`)
          }
        >
          View All →
        </button>
      </div>

      <div className="similar-products__track">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="sim-card sim-card--skeleton">
                <div className="sim-card__img skeleton" style={{ height: 160 }} />
                <div className="sim-card__body">
                  <div className="skeleton" style={{ height: 13, width: "85%", borderRadius: 4, marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 13, width: "50%", borderRadius: 4, marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 13, width: "60%", borderRadius: 4 }} />
                </div>
              </div>
            ))
          : products.map((p) => {
              const off = discount(p.originalPrice, p.price);
              return (
                <button
                  key={p.id}
                  className="sim-card"
                  onClick={() => navigate(`${PATHS.PRODUCTS}/${p.id}`)}
                  aria-label={p.name}
                >
                  {off && <span className="sim-card__badge">{off}% OFF</span>}
                  <div className="sim-card__img-wrap">
                    <img
                      src={
                        p.imageUrl ||
                        "https://via.placeholder.com/200x200?text=No+Image"
                      }
                      alt={p.name}
                      className="sim-card__img"
                      loading="lazy"
                    />
                  </div>
                  <div className="sim-card__body">
                    {p.rating && (
                      <span className="sim-card__rating">
                        ★ {Number(p.rating).toFixed(1)}
                      </span>
                    )}
                    <p className="sim-card__name">{p.name}</p>
                    <p className="sim-card__price">{formatPrice(p.price)}</p>
                    {p.originalPrice > p.price && (
                      <p className="sim-card__original">{formatPrice(p.originalPrice)}</p>
                    )}
                  </div>
                </button>
              );
            })}
      </div>
    </section>
  );
};

export default SimilarProducts;
