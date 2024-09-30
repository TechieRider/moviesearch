import { Component, OnInit, OnDestroy } from '@angular/core';
import { MovieService } from '../../../service/movie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { extractUniqueGenres, createApplicableGenreFilter, extractUniqueLanguages, createApplicableLanguageFilter } from '../../../helpers/syntaxConverter';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FilterAccordionComponent } from '../../filter-accordion/filter-accordion.component';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, FilterAccordionComponent, MatIconModule, MatInputModule, MatFormFieldModule],
  styleUrls: ['./movie-list.component.css']
})

export class MovieListComponent implements OnInit {
  movies: any[] = [];
  filteredMovies: any[] = [];
  genres: any[] = [];
  languages: any[] = [];
  genreFilterState: any[] = [];
  languageFilterState: any[] = [];
  searchString: string = '';
  clearMessage = 'Clear';
  accordionHeader: string = 'Filter by genres';
  accordionHeader2: string = 'Filter by languages';
  private destroy$ = new Subject<void>();

  constructor(private movieService: MovieService) {}
  

  ngOnInit(): void {
    this.movieService.getMovies()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      const { Movies } = data;
      this.movies = Movies;
      this.filteredMovies = Movies;
      this.genres = extractUniqueGenres(this.movies);
      this.languages = extractUniqueLanguages(this.movies);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterByGenre(genre: string) {
    this.genreFilterState = createApplicableGenreFilter(this.genreFilterState, genre)
    return this.filteredMovies.filter(movie => 
      this.genreFilterState.some(filterGenre => 
        movie.Genre.split(', ').map((genre: string) => genre.trim()).includes(filterGenre)
      )
    );
  }

  filterByLanguage(language: string) {
    this.languageFilterState = createApplicableLanguageFilter(this.languageFilterState, language)
    return this.filteredMovies.filter(movie => 
      this.languageFilterState.some(filterLanguage => 
        movie.Language.split(', ').map((language: string) => language.trim()).includes(filterLanguage)
      )
    );
  }

  filterMovies(filterCategory: 'byString' | 'byGenre' | 'byLanguage', filterValue?: string) {
    const filterMapper: Record<'byString' | 'byGenre' | 'byLanguage', (value: string) => any[]> = {
      byString: (searchString: string) => this.filterMoviesByString(searchString),
      byGenre: (genre: string) => this.filterByGenre(genre),
      byLanguage: (language: string) => this.filterByLanguage(language)
    };
  
    const filteredMovies = filterMapper[filterCategory](filterValue || '');
    this.filteredMovies = (this.searchString === '' && this.genreFilterState.length === 0 && this.languageFilterState.length === 0) 
      ? this.movies 
      : filteredMovies;
  }
  

  filterMoviesByString(searchString: string) {
    const lowerCaseSearch = searchString.toLowerCase();
    const fieldsToSearch = ['Title', 'Actors', 'Director', 'Plot'];
    this.searchString = searchString;
    
    return this.filteredMovies.filter(movie => 
      fieldsToSearch.some(field => 
        movie[field]?.toLowerCase().includes(lowerCaseSearch)
      )
    );
  } 

  updateFilter(event: { filterCategory: 'byString' | 'byGenre' | 'byLanguage', filterTile: string }) {
    this.filterMovies(event.filterCategory, event.filterTile);
  }

  reset() {
    this.filteredMovies = this.movies;
    this.searchString = '';
    this.genreFilterState = [];
    this.languageFilterState = [];
  }
  
}
