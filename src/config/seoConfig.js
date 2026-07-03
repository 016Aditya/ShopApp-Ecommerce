/**
 * SEO Configuration and Defaults
 * Centralized metadata for all pages
 */

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://shop.example.com';
const SITE_NAME = 'Shop Fashion';
const BRAND_NAME = 'Shop Fashion';

export const SEO_CONFIG = {
  BASE_URL,
  SITE_NAME,
  BRAND_NAME,

  // Default meta tags
  defaults: {
    locale: 'en_US',
    type: 'website',
  },

  // Page metadata
  pages: {
    HOME: {
      title: 'Shop Fashion - Discover Latest Trends & Deals',
      description: 'Discover the latest fashion products with fast delivery. Shop clothing, electronics, home & kitchen, and more at the best prices.',
      type: 'website',
    },
    PRODUCTS: {
      title: 'Products | Shop Fashion',
      description: 'Browse our collection of fashion products, electronics, and more. Find the latest trends and best deals.',
      type: 'website',
    },
    WISHLIST: {
      title: 'My Wishlist | Shop Fashion',
      description: 'View your saved wishlist items and shop your favorite products.',
      type: 'website',
      robots: 'noindex,nofollow',
    },
    CART: {
      title: 'Shopping Cart | Shop Fashion',
      description: 'Review your shopping cart and proceed to checkout.',
      type: 'website',
      robots: 'noindex,nofollow',
    },
    CHECKOUT: {
      title: 'Checkout | Shop Fashion',
      description: 'Complete your purchase securely.',
      type: 'website',
      robots: 'noindex,nofollow',
    },
    ORDERS: {
      title: 'My Orders | Shop Fashion',
      description: 'View your order history and track your deliveries.',
      type: 'website',
      robots: 'noindex,nofollow',
    },
    PROFILE: {
      title: 'My Profile | Shop Fashion',
      description: 'Manage your account settings and personal information.',
      type: 'website',
      robots: 'noindex,nofollow',
    },
    LOGIN: {
      title: 'Sign In | Shop Fashion',
      description: 'Sign in to your Shop Fashion account to access your orders and wishlist.',
      type: 'website',
      robots: 'noindex,nofollow',
    },
    REGISTER: {
      title: 'Create Account | Shop Fashion',
      description: 'Create a new Shop Fashion account to start shopping.',
      type: 'website',
      robots: 'noindex,nofollow',
    },
    CUSTOMER_SERVICE: {
      title: 'Customer Service | Shop Fashion',
      description: 'Get help with your orders, returns, and more. Contact our customer service team.',
      type: 'website',
    },
  },
};

/**
 * Get page title with brand name
 */
export function getPageTitle(pageTitle) {
  if (!pageTitle) return SITE_NAME;
  if (pageTitle.includes('|')) return pageTitle; // Already formatted
  return `${pageTitle} | ${SITE_NAME}`;
}

/**
 * Build canonical URL
 */
export function buildCanonicalURL(path) {
  return `${BASE_URL}${path}`.replace(/\/$/, ''); // Remove trailing slash for consistency
}

/**
 * Create product schema
 */
export function createProductSchema({
  id,
  name,
  description,
  image,
  brand,
  price,
  currency = 'USD',
  availability = 'https://schema.org/InStock',
  rating,
  reviews = [],
  url,
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: Array.isArray(image) ? image : [image],
    brand: {
      '@type': 'Brand',
      name: brand || BRAND_NAME,
    },
    offers: {
      '@type': 'Offer',
      url: url || `${BASE_URL}/products/${id}`,
      priceCurrency: currency,
      price: String(price),
      availability,
    },
  };

  // Add rating if available
  if (rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(rating.average || 0),
      ratingCount: String(rating.count || 0),
    };
  }

  // Add reviews if available
  if (reviews.length > 0) {
    schema.review = reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.authorName || 'Customer',
      },
      datePublished: review.date || new Date().toISOString(),
      description: review.text || '',
      ratingValue: String(review.rating || 0),
    }));
  }

  return schema;
}

/**
 * Create breadcrumb schema
 */
export function createBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}

/**
 * Create organization schema
 */
export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [
      'https://www.facebook.com/shopfashion',
      'https://www.twitter.com/shopfashion',
      'https://www.instagram.com/shopfashion',
    ],
  };
}

export default SEO_CONFIG;
