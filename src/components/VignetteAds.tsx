import { useEffect } from 'react';

export function VignetteAds() {
  useEffect(() => {
    const existing = document.querySelector(
      'script[data-zone="11037895"]'
    );

    if (existing) return;

    const script = document.createElement('script');

    script.dataset.zone = '11037895';
    script.src = 'https://n6wxm.com/vignette.min.js';
    script.async = true;

    document.body.appendChild(script);
  }, []);

  return null;
}