import { useEffect, useMemo, useState } from 'react';

const DEFAULT_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" rx="24" fill="#f3f4f6"/>
      <rect x="100" y="118" width="200" height="164" rx="18" fill="#d1d5db"/>
      <circle cx="158" cy="170" r="20" fill="#9ca3af"/>
      <path d="M126 258l56-56 36 36 28-28 28 48H126Z" fill="#9ca3af"/>
    </svg>
  `);

const DEFAULT_WIDTHS = [160, 240, 320, 480, 640, 800, 1200];

function canTransform(src) {
  return Boolean(src) && !src.startsWith('data:') && !src.startsWith('blob:');
}

function normalizeUrl(url) {
  if (!url) return null;
  try {
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    return new URL(url, base);
  } catch {
    return null;
  }
}

function withSearchParams(src, params = {}) {
  const url = normalizeUrl(src);
  if (!url) return null;

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  if (/^https?:\/\//i.test(src)) return url.toString();
  return `${url.pathname}${url.search}${url.hash}`;
}

function replaceExtension(src, nextExtension) {
  if (!canTransform(src)) return null;
  const hasKnownExtension = /\.(png|jpe?g|webp|avif)(\?.*)?$/i.test(src);
  if (!hasKnownExtension) return null;
  return src.replace(/\.(png|jpe?g|webp|avif)(\?.*)?$/i, `.${nextExtension}$2`);
}

function buildSourceSet(src, widths = [], format) {
  if (!canTransform(src) || !widths.length) return null;

  const entries = widths
    .map((width) => {
      const transformed = format
        ? replaceExtension(src, format) ?? withSearchParams(src, { w: width, format })
        : withSearchParams(src, { w: width });

      if (!transformed) return null;
      return `${transformed} ${width}w`;
    })
    .filter(Boolean);

  return entries.length ? entries.join(', ') : null;
}

export default function OptimizedImage({
  src,
  alt,
  fallbackSrc = DEFAULT_PLACEHOLDER,
  width,
  height,
  className = '',
  style,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  sizes,
  srcSet,
  responsiveWidths = DEFAULT_WIDTHS,
  useModernFormats = true,
  onError,
  onLoad,
  ...rest
}) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setLoaded(false);
  }, [src, fallbackSrc]);

  const computedSrcSet = useMemo(() => {
    if (srcSet) return srcSet;
    return buildSourceSet(currentSrc, responsiveWidths);
  }, [currentSrc, responsiveWidths, srcSet]);

  const avifSrcSet = useMemo(() => {
    if (!useModernFormats) return null;
    return buildSourceSet(currentSrc, responsiveWidths, 'avif');
  }, [currentSrc, responsiveWidths, useModernFormats]);

  const webpSrcSet = useMemo(() => {
    if (!useModernFormats) return null;
    return buildSourceSet(currentSrc, responsiveWidths, 'webp');
  }, [currentSrc, responsiveWidths, useModernFormats]);

  const handleError = (event) => {
    if (currentSrc !== fallbackSrc && fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setLoaded(false);
    } else if (currentSrc !== DEFAULT_PLACEHOLDER) {
      setCurrentSrc(DEFAULT_PLACEHOLDER);
      setLoaded(false);
    }
    onError?.(event);
  };

  const handleLoad = (event) => {
    setLoaded(true);
    onLoad?.(event);
  };

  const image = (
    <img
      {...rest}
      src={currentSrc || fallbackSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{
        backgroundColor: loaded ? undefined : 'rgba(148, 163, 184, 0.08)',
        ...style,
      }}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      sizes={sizes}
      srcSet={computedSrcSet ?? undefined}
      onError={handleError}
      onLoad={handleLoad}
    />
  );

  if (!useModernFormats) {
    return image;
  }

  return (
    <picture>
      {avifSrcSet ? <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} /> : null}
      {webpSrcSet ? <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} /> : null}
      {image}
    </picture>
  );
}
