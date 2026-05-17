import { useSeo } from '@/hooks/useSeo';

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
}

export function Seo({
  title = 'StreamForge',
  description = 'Premium cinematic streaming — movies, TV, and anime.',
  image,
}: SeoProps) {
  const fullTitle = title.includes('StreamForge') ? title : `${title} | StreamForge`;

  useSeo({ title: fullTitle, description, image });

  return null;
}
