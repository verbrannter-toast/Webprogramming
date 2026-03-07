import GenreMoviesPage from '../GenreMoviesPage';
import { getGenreBySlugOrThrow } from '../config';

const genreConfig = getGenreBySlugOrThrow('drama');

export default function DramaGenrePage() {
  return (
    <GenreMoviesPage
      genre={genreConfig.genre}
      slug={genreConfig.slug}
      heading={genreConfig.heading}
    />
  );
}