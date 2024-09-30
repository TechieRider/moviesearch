import {ChangeDetectionStrategy, Component, signal, Input, Output, EventEmitter} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-filter-accordion',
  standalone: true,
  imports: [MatExpansionModule, CommonModule, MatGridListModule],
  templateUrl: './filter-accordion.component.html',
  styleUrl: './filter-accordion.component.css'
})

export class FilterAccordionComponent {
  @Input() header: string = '';
  @Input() filterTiles: string[] = [];
  @Input() category: string = '';

  @Output() genreSelected = new EventEmitter<{ filterCategory: 'byString' | 'byGenre' | 'byLanguage', filterTile: string }>();

  activeTile: string | null = null;

  selectGenre(filterTile: string) {
    this.activeTile = filterTile;
    console.log(this.activeTile)
    this.genreSelected.emit({ filterCategory: 'byGenre', filterTile });
  }

  selectLanguage(filterTile: string) {
    this.activeTile = filterTile;
    this.genreSelected.emit({ filterCategory: 'byLanguage', filterTile });
  }
}
