import { Component } from '@angular/core';
import {LibraryListComponent} from "../../components/library-list/library-list.component";
import {
  LibraryCategoriesComponent
} from "../../components/library-categories/library-categories.component";
import {NavbarComponent} from "../../../navbar/navbar.component";


@Component({
  selector: 'app-library-page',
  standalone: true,
  imports: [
    LibraryListComponent,
    LibraryCategoriesComponent,
    NavbarComponent
  ],
  templateUrl: './library-page.component.html',
  styleUrl: './library-page.component.scss'
})
export class LibraryPageComponent {

}
