import { useState } from 'react';
import '../styles/ProductDetail.css';

const PLACEHOLDER = 'https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image';

/**
 * ProductImageGallery
 * Displays a main image + thumbnail row.
 * Stage 1: hero image uses eager loading + fetchpriority=high to improve LCP.
 * Thumbnail images use lazy loading since they are below the fold.
 */
const ProductImageGallery = ({ imageUrl, name }) => {
  const images = imageUrl ? [imageUrl] : [];
  const [active, setActive] = useState(images[0] ?? null);
  const [zoomed, setZoomed] = useState(false);

  const src = active ?? PLACEHOLDER;

  return (
    <div className="pdp-gallery">
      {/* Main image — eager + high priority for LCP */}
      <div
        className={`pdp-gallery__main${zoomed ? ' pdp-gallery__main--zoomed' : ''}`}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        <img
          src={src}
          alt={name}
          loading="eager"
          fetchpriority="high"
          decoding="async"
          width={400}
          height={400}
        />
      </div>

      {/* Thumbnails — lazy load since they are below the fold */}
      {images.length > 1 && (
        <div className="pdp-gallery__thumbs">
          {images.map((url, i) => (
            <button
              key={i}
              className={`pdp-gallery__thumb${active === url ? ' pdp-gallery__thumb--active' : ''}`}
              onClick={() => setActive(url)}
              aria-label={`View image ${i + 1}`}
            >
              <img
                src={url}
                alt={`${name} ${i + 1}`}
                loading="lazy"
                decoding="async"
                width={80}
                height={80}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
