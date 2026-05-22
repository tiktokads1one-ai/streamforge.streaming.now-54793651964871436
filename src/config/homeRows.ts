/** Curated home page rows — genre discover + emoji label */
export interface HomeRowConfig {
  emoji: string;
  title: string;
  genre: string;
  mediaType?: 'movie' | 'tv';
  viewAllHref?: string;
}

export const HOME_CONTENT_ROWS: HomeRowConfig[] = [
  { emoji: '👻', title: 'Horror Picks', genre: 'Horror' },
  { emoji: '🚀', title: 'Sci-Fi', genre: 'Science Fiction' },
  { emoji: '😂', title: 'Comedy', genre: 'Comedy' },
  { emoji: '⚔️', title: 'Adventure', genre: 'Adventure' },
  { emoji: '🕵️', title: 'Crime', genre: 'Crime' },
  { emoji: '💥', title: 'Action', genre: 'Action' },
  { emoji: '🎌', title: 'Anime', genre: 'Animation', mediaType: 'tv' },
  { emoji: '🧟', title: 'Zombie', genre: 'Horror' },
  { emoji: '👽', title: 'Mystery', genre: 'Mystery' },
  { emoji: '❤️', title: 'Romance', genre: 'Romance' },
  { emoji: '🔪', title: 'Thriller', genre: 'Thriller' },
  { emoji: '🏆', title: 'Award Winners', genre: '' },
];
