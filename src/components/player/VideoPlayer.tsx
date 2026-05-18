import { useMemo,useState } from 'react';
import { motion } from 'framer-motion';

import type { MediaItem } from '@/types/media';
import type { ProviderContext } from '@/providers/Provider';

import {
getPlaybackSource
} from '@/providers/providerManager';

import {
useLibraryStore
} from '@/store/useLibraryStore';

import {
ServerSelector
} from './ServerSelector';

import {
EpisodeSelector
} from './episodeselector';

interface Props{
media:MediaItem;
startAt?:number;
}

export function VideoPlayer({
media,
startAt
}:Props){

const playback=
useLibraryStore(
s=>s.playback
);

const [season,setSeason]=
useState(1);

const [episode,setEpisode]=
useState(1);

const [loading,setLoading]=
useState(true);

const [error,setError]=
useState(false);

const isSeries=
media.mediaType==="tv"||
media.mediaType==="anime";

const ctx:ProviderContext=
useMemo(()=>({

mediaId:
String(media.id),

mediaType:
media.mediaType,

season:
season,

episode:
episode,

startAt,

autoplay:
playback.autoplay

}),[
media.id,
media.mediaType,
season,
episode,
startAt,
playback.autoplay
]);

const source=
getPlaybackSource(
ctx
);

return(

<motion.section>

<motion.div
className="
relative
aspect-video
overflow-hidden
rounded-3xl
border
border-purple-500/30
bg-black
"
>


<iframe
  key={`${media.id}-${season}-${episode}-${source}`}
  src={source}
  id="streamforge-player"
  title={media.title}
  className="h-full w-full"
  allowFullScreen
  allow="fullscreen; autoplay"
  referrerPolicy="origin"
  onLoad={()=>{
    setLoading(false)
  }}
  onError={()=>{
    setLoading(false)
    setError(true)
  }}
/>

{loading&&(
<div
className="
absolute
inset-0
bg-black
flex
items-center
justify-center
text-purple-400
"
>

Loading...

</div>
)}

{error&&(

<div
className="
absolute
inset-0
bg-black
flex
items-center
justify-center
text-red-400
"
>

Provider failed

</div>

)}

</motion.div>

<ServerSelector/>

{isSeries&&(

<EpisodeSelector

tmdbId={
String(
media.id
)
}

currentSeason={
season
}

currentEpisode={
episode
}

onSeasonChange={(s)=>{

setSeason(s);

setEpisode(1);

}}

onEpisodeSelect={(ep)=>{
  setLoading(true);
  setError(false);

  requestAnimationFrame(()=>{
    setEpisode(ep);
  });
}}

/>

)}

</motion.section>

)

}