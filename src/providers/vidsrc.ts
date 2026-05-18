import type {
  Provider,
  ProviderContext
} from './Provider';

export const vidsrcProvider: Provider = {

  id:'vidsrc',

  name:'VidSrc',

  quality:'HD',

  description:'Wide compatibility',

  getPlaybackSource:(
    ctx:ProviderContext
  ):string=>{

    const isTv=
      ctx.mediaType==='tv'||
      ctx.mediaType==='anime';

    const t=
      Date.now();

    if(isTv){

      const season=
      ctx.season ?? 1;

      const episode=
      ctx.episode ?? 1;

      return `https://vidsrc.to/embed/tv/${ctx.mediaId}/${season}/${episode}?t=${t}`;
    }

    return `https://vidsrc.to/embed/movie/${ctx.mediaId}?t=${t}`;
  }
};