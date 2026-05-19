import { useEffect } from 'react';

export function VignetteAds() {
  useEffect(() => {
    const s = document.createElement('script');

    s.dataset.zone = '11029009';
    s.src = 'https://n6wxm.com/vignette.min.js';
    s.async = true;

    document.body.appendChild(s);

    return () => {
      if (document.body.contains(s)) {
        document.body.removeChild(s);
      }
    };
  }, []);

  return null;
}