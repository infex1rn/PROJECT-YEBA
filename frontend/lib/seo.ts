/**
 * SEO Utilities for Next.js
 * Provides metadata generation and JSON-LD schemas
 */

import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  price?: number;
  currency?: string;
}

/**
 * Generate comprehensive metadata for a page
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = '/og-image.png',
    url = 'https://deepfold.com',
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
  } = config;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: 'DeepFold',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@deepfold',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate JSON-LD schema for Organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DeepFold',
    description: 'Premium design marketplace for buyers and designers',
    url: 'https://deepfold.com',
    logo: 'https://deepfold.com/logo.png',
    sameAs: [
      'https://twitter.com/deepfold',
      'https://facebook.com/deepfold',
      'https://instagram.com/deepfold',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-0123',
      contactType: 'Customer Service',
      email: 'support@deepfold.com',
    },
  };
}

/**
 * Generate JSON-LD schema for Product (Design)
 */
export function generateProductSchema(design: {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  rating?: number;
  reviewCount?: number;
  designer: { name: string };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: design.title,
    description: design.description,
    image: design.image,
    offers: {
      '@type': 'Offer',
      price: design.price,
      priceCurrency: design.currency,
      availability: 'https://schema.org/InStock',
      url: `https://deepfold.com/designs/${design.id}`,
    },
    brand: {
      '@type': 'Brand',
      name: design.designer.name,
    },
    aggregateRating: design.rating ? {
      '@type': 'AggregateRating',
      ratingValue: design.rating,
      reviewCount: design.reviewCount || 0,
    } : undefined,
  };
}

/**
 * Generate JSON-LD schema for BreadcrumbList
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate JSON-LD schema for Person (Designer)
 */
export function generatePersonSchema(designer: {
  id: string;
  name: string;
  bio: string;
  image: string;
  rating?: number;
  salesCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: designer.name,
    description: designer.bio,
    image: designer.image,
    url: `https://deepfold.com/designers/${designer.id}`,
    aggregateRating: designer.rating ? {
      '@type': 'AggregateRating',
      ratingValue: designer.rating,
      reviewCount: designer.salesCount || 0,
    } : undefined,
  };
}

/**
 * Generate JSON-LD schema for Review
 */
export function generateReviewSchema(review: {
  rating: number;
  text: string;
  author: string;
  datePublished: string;
  itemReviewed: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
    },
    reviewBody: review.text,
    author: {
      '@type': 'Person',
      name: review.author,
    },
    datePublished: review.datePublished,
    itemReviewed: {
      '@type': 'Product',
      name: review.itemReviewed,
    },
  };
}

/**
 * Generate sitemap XML
 */
export function generateSitemap(urls: { loc: string; lastmod?: string; priority?: number }[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <priority>${url.priority || 0.5}</priority>
  </url>`).join('\n')}
</urlset>`;
}

/**
 * Default SEO config for the site
 */
export const defaultSEO: SEOConfig = {
  title: 'DeepFold - Premium Design Marketplace',
  description: 'Buy and sell premium design assets. Browse thousands of high-quality logos, graphics, templates, and more from talented designers worldwide.',
  keywords: [
    'design marketplace',
    'graphic design',
    'logo design',
    'templates',
    'design assets',
    'buy designs',
    'sell designs',
    'creative marketplace',
  ],
  url: 'https://deepfold.com',
  type: 'website',
};
