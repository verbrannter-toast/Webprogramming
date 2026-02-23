import GenreMoviesPage from '../GenreMoviesPage';
import { getGenreBySlugOrThrow } from '../config';

const genreConfig = getGenreBySlugOrThrow('horror');

export default function HorrorGenrePage() {
  return (
    <GenreMoviesPage
      genre={genreConfig.genre}
      slug={genreConfig.slug}
      heading={genreConfig.heading}
    />
  );
}