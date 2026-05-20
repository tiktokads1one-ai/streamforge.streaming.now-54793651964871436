import { useEffect } from 'react';

export function VignetteAds() {
  useEffect(() => {
    // avoid duplicate injection on hot reload/navigation
    const existing = document.querySelector(
      'script[data-zone="11029009"]'
    );

    if (existing) return;

    const script = document.createElement('script');

    script.dataset.zone = '11029009';
    script.src = 'https://n6wxm.com/vignette.min.js';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      // keep script loaded globally; don't remove on route changes
    };
  }, []);

  return null;
}