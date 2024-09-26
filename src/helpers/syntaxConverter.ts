export function extractUniqueGenres(movies: any[]): string[] {
    const genresSet = new Set<string>();
    movies.forEach(movie => {
      movie.Genre.split(', ').forEach((genre: string) => {
        genresSet.add(genre);
      });
    });
    return Array.from(genresSet);
  }

  export function extractUniqueLanguages(movies: any[]): string[] {
    const languagesSet = new Set<string>();
    movies.forEach(movie => {
      movie.Language.split(', ').forEach((genre: string) => {
        languagesSet.add(genre);
      });
    });
    return Array.from(languagesSet);
  }

  export function createApplicableGenreFilter(genres: string[], latestGenre: string): string[] {
    const genreIndex = genres.indexOf(latestGenre);
  
    return genreIndex > -1
      ? genres.filter((_, index) => index !== genreIndex)
      : [...genres, latestGenre];
  }

  export function createApplicableLanguageFilter(languages: string[], latestLanguage: string): string[] {

    const languageIndex = languages.indexOf(latestLanguage);
  
    return languageIndex > -1
      ? languages.filter((_, index) => index !== languageIndex)
      : [...languages, latestLanguage];
  }
  