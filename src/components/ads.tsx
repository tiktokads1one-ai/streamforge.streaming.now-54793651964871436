import { useEffect } from 'react';

export function VignetteAds() {

  useEffect(() => {

    const script = document.createElement('script');

    script.dataset.zone='11029009';

    script.src='https://n6wxm.com/vignette.min.js';

    script.async=true;

    document.body.appendChild(script);

    return ()=>{

      document.body.removeChild(script);

    }

  },[])

  return null;

}
