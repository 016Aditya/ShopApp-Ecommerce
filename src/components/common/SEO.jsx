import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEO Component
 * Manages meta tags, structured data, and SEO elements for the current page.
 * 
 * Usage:
 *   <SEO
 *     title="Product Name | Shop Fashion"
 *     description="Buy Product Name at the best price."
 *     image="https://example.com/product.jpg"
 *     type="product"
 *     url="https://example.com/products/123"
 *     schema={{...}}
 *   />
 */

export function SEO({
  title,
  description,
  image,
  type = 'website',
  url,
  schema,
  robots,
}) {
  const location = useLocation();
  const currentUrl = url || `${window.location.origin}${location.pathname}${location.search}`;

  useEffect(() => {
    // Set document title
    if (title) {
      document.title = title;
      updateMetaTag('og:title', title);
      updateMetaTag('twitter:title', title);
    }

    // Set meta description
    if (description) {
      updateMetaTag('description', description);
      updateMetaTag('og:description', description);
      updateMetaTag('twitter:description', description);
    }

    // Set image
    if (image) {
      updateMetaTag('og:image', image);
      updateMetaTag('twitter:image', image);
    }

    // Set OG type
    if (type) {
      updateMetaTag('og:type', type);
    }

    // Set canonical URL
    if (currentUrl) {
      updateCanonicalURL(currentUrl);
      updateMetaTag('og:url', currentUrl);
    }

    // Set robots meta tag
    if (robots) {
      updateMetaTag('robots', robots);
    }

    // Add structured data (JSON-LD)
    if (schema) {
      updateStructuredData(schema);
    }

    // Twitter Card type (default to summary_large_image)
    updateMetaTag('twitter:card', 'summary_large_image');

    return () => {
      // Cleanup is not necessary for meta tags as they persist
      // but we could add cleanup logic if needed
    };
  }, [title, description, image, type, currentUrl, schema, robots]);

  return null; // This component doesn't render anything
}

/**
 * Update or create a meta tag
 */
function updateMetaTag(name, content) {
  if (!content) return;

  // Check if it's a property (og:, twitter:) or name attribute
  const isProperty = name.includes(':');
  const selector = isProperty
    ? `meta[property="${name}"]`
    : `meta[name="${name}"]`;

  let tag = document.querySelector(selector);

  if (!tag) {
    tag = document.createElement('meta');
    if (isProperty) {
      tag.setAttribute('property', name);
    } else {
      tag.setAttribute('name', name);
    }
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
}

/**
 * Update or create canonical URL
 */
function updateCanonicalURL(url) {
  let canonical = document.querySelector('link[rel="canonical"]');

  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }

  canonical.setAttribute('href', url);
}

/**
 * Update structured data (JSON-LD)
 */
function updateStructuredData(schema) {
  // Remove existing structured data script
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }

  // Add new structured data
  if (schema) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}

export default SEO;
