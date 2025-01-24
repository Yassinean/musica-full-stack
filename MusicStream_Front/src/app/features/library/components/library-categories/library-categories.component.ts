import { Component } from '@angular/core';
import {MusicCategory} from "../../../../core/models/track.model";
import {KeyValuePipe, NgForOf, TitleCasePipe} from "@angular/common";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";


@Component({
  selector: 'app-library-categories',
  standalone: true,
  imports: [
    NgForOf,
    TitleCasePipe,
    KeyValuePipe
  ],
  templateUrl: './library-categories.component.html',
  styleUrl: './library-categories.component.scss'
})
export class LibraryCategoriesComponent {
  musicCategory = MusicCategory;

  constructor(private readonly store: Store) {
  }
}
