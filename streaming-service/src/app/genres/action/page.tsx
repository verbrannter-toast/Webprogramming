import GenreMoviesPage from '../GenreMoviesPage';
import { getGenreBySlugOrThrow } from '../config';

const genreConfig = getGenreBySlugOrThrow('action');

export default function ActionGenrePage() {
  return (
    <GenreMoviesPage
      genre={genreConfig.genre}
      slug={genreConfig.slug}
      heading={genreConfig.heading}
    />
  );
}