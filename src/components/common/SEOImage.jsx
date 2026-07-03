import React from 'react';

/**
 * SEO-Friendly Image Component
 *
 * Ensures all images have:
 * - Descriptive alt text
 * - Width and height attributes
 * - Loading optimization
 *
 * Usage:
 *   <SEOImage
 *     src="/product.jpg"
 *     alt="Blue cotton t-shirt for men"
 *     width={400}
 *     height={500}
 *     className="product-image"
 *   />
 */
export const SEOImage = React.forwardRef(
  (
    {
      src,
      alt,
      width,
      height,
      loading = 'lazy',
      decoding = 'async',
      className = '',
      ...props
    },
    ref
  ) => {
    // Ensure alt text is always provided
    if (!alt || alt.trim() === '') {
      console.warn(
        `Image without alt text: ${src}. This hurts SEO and accessibility.`
      );
    }

    // Warn if width/height are missing
    if (!width || !height) {
      console.warn(
        `Image dimensions missing for ${src}. Specifying width and height prevents layout shift.`
      );
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt || 'Product image'}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        className={className}
        {...props}
      />
    );
  }
);

SEOImage.displayName = 'SEOImage';

export default SEOImage;
