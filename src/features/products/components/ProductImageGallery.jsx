import { useState } from "react";
import "../styles/ProductDetail.css";

const PLACEHOLDER = "https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image";

/**
 * ProductImageGallery
 * Displays a main image + thumbnail row.
 * If the product only has one imageUrl we show it large with a subtle zoom-in hover.
 */
const ProductImageGallery = ({ imageUrl, name }) => {
  // Build a small gallery — if backend later returns an array, swap this line.
  const images = imageUrl ? [imageUrl] : [];
  const [active, setActive] = useState(images[0] ?? null);
  const [zoomed, setZoomed] = useState(false);

  const src = active ?? PLACEHOLDER;

  return (
    <div className="pdp-gallery">
      {/* Main image */}
      <div
        className={`pdp-gallery__main${zoomed ? " pdp-gallery__main--zoomed" : ""}`}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        <img src={src} alt={name} loading="lazy" />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="pdp-gallery__thumbs">
          {images.map((url, i) => (
            <button
              key={i}
              className={`pdp-gallery__thumb${active === url ? " pdp-gallery__thumb--active" : ""}`}
              onClick={() => setActive(url)}
              aria-label={`View image ${i + 1}`}
            >
              <img src={url} alt={`${name} ${i + 1}`} loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
