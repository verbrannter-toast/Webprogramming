export interface GenreConfig {
  slug: string;
  genre: string;
  label: string;
  heading?: string;
}

export const GENRE_CONFIGS: GenreConfig[] = [
  { slug: 'comedy', genre: 'Comedy', label: 'Comedy' },
  { slug: 'action', genre: 'Action', label: 'Action' },
  { slug: 'horror', genre: 'Horror', label: 'Horror' },
  { slug: 'romance', genre: 'Romance', label: 'Romance' },
  { slug: 'sci-fi', genre: 'Sci-Fi', label: 'Sci-Fi' },
  { slug: 'drama', genre: 'Drama', label: 'Drama' },
  { slug: 'animation', genre: 'Animation', label: 'Animation' },
  { slug: 'documentary', genre: 'Documentary', label: 'Documentary', heading: 'Documentaries' }
];

export const getGenreBySlug = (slug: string): GenreConfig | undefined => {
  return GENRE_CONFIGS.find((genreConfig) => genreConfig.slug === slug);
};

export const getGenreBySlugOrThrow = (slug: string): GenreConfig => {
  const genreConfig = getGenreBySlug(slug);

  if (!genreConfig) {
    throw new Error(`Unknown genre slug: ${slug}`);
  }

  return genreConfig;
};

export const getGenreStaticParams = () => {
  return GENRE_CONFIGS.map(({ slug }) => ({ slug }));
};
