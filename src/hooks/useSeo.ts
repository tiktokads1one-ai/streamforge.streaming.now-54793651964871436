import { useEffect } from 'react';

interface SeoOptions {
  title: string;
  description: string;
  image?: string;
}

function upsertMeta(
  attribute: 'name' | 'property',
  key: string,
  content: string,
): void {
  let el = document.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  );
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function useSeo({ title, description, image }: SeoOptions): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);

    if (image) {
      upsertMeta('property', 'og:image', image);
      upsertMeta('name', 'twitter:image', image);
    }

    return () => {
      document.title = previousTitle;
    };
  }, [title, description, image]);
}
