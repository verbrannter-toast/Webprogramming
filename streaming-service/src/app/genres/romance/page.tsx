import GenreMoviesPage from '../GenreMoviesPage';
import { getGenreBySlugOrThrow } from '../config';

const genreConfig = getGenreBySlugOrThrow('romance');

export default function RomanceGenrePage() {
  return (
    <GenreMoviesPage
      genre={genreConfig.genre}
      slug={genreConfig.slug}
      heading={genreConfig.heading}
    />
  );
}