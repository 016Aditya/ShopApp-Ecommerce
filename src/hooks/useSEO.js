import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  SEO_CONFIG,
  getPageTitle,
  buildCanonicalURL,
  createProductSchema,
  createBreadcrumbSchema,
} from '@/config/seoConfig';

/**
 * Hook to manage SEO for the current page
 *
 * Usage:
 *   const { seoProps } = useSEO({
 *     title: 'Product Name | Shop Fashion',
 *     description: 'Buy Product Name at the best price.',
 *   });
 *   return <SEO {...seoProps} />;
 */
export function useSEO(options = {}) {
  const location = useLocation();

  const seoProps = useMemo(() => {
    const {
      title,
      description,
      image,
      type = 'website',
      robots,
      schema,
      customUrl,
    } = options;

    const canonicalUrl = buildCanonicalURL(
      customUrl || location.pathname + location.search
    );

    return {
      title: title ? getPageTitle(title) : getPageTitle('Shop Fashion'),
      description: description || SEO_CONFIG.pages.HOME.description,
      image: image || null,
      type,
      url: canonicalUrl,
      robots,
      schema,
    };
  }, [options, location.pathname, location.search]);

  return { seoProps };
}

/**
 * Hook specifically for product pages
 */
export function useProductSEO(product, customUrl) {
  const location = useLocation();

  const seoProps = useMemo(() => {
    if (!product) {
      return {
        title: 'Product | Shop Fashion',
        description: 'View our products at Shop Fashion.',
        type: 'product',
      };
    }

    const title = `${product.name} | Shop Fashion`;
    const description = `Buy ${product.name} at the best price. ${product.description ? product.description.substring(0, 100) : ''}`;
    const image = product.image || product.imageUrl || null;
    const canonicalUrl = buildCanonicalURL(customUrl || location.pathname);

    // Create product schema
    const schema = createProductSchema({
      id: product.id,
      name: product.name,
      description: product.description,
      image,
      brand: product.brand || 'Shop Fashion',
      price: product.price,
      currency: product.currency || 'USD',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      rating: product.rating ? {
        average: product.rating.average,
        count: product.rating.count,
      } : null,
      reviews: product.reviews || [],
      url: canonicalUrl,
    });

    return {
      title,
      description,
      image,
      type: 'product',
      url: canonicalUrl,
      robots: 'index,follow',
      schema,
    };
  }, [product, location.pathname, customUrl]);

  return { seoProps };
}

/**
 * Hook for breadcrumb navigation with schema
 */
export function useBreadcrumbs(items) {
  const schema = useMemo(
    () => (items && items.length > 0 ? createBreadcrumbSchema(items) : null),
    [items]
  );

  return { schema };
}

export default useSEO;
