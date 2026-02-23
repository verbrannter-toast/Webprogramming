import GenreMoviesPage from '../GenreMoviesPage';
import { getGenreBySlugOrThrow } from '../config';

const genreConfig = getGenreBySlugOrThrow('sci-fi');

export default function SciFiGenrePage() {
  return (
    <GenreMoviesPage
      genre={genreConfig.genre}
      slug={genreConfig.slug}
      heading={genreConfig.heading}
    />
  );
}