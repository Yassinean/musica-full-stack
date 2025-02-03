import { Component, type OnInit } from "@angular/core"
import { Store } from "@ngrx/store"
import {  Router, RouterLink } from "@angular/router"
import * as AlbumActions from "../../store/album/album.actions"
import { FormControl, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { selectAlbums, selectError, selectLoading } from "../../store/album/album.selectors"
import { debounceTime, distinctUntilChanged, switchMap,Observable, of } from "rxjs"

@Component({
  selector: "app-album-list",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./album-list.component.html",
  styleUrl: "./album-list.component.scss",
})
export class AlbumListComponent implements OnInit {
  albums$ = this.store.select(selectAlbums)
  loading$ = this.store.select(selectLoading)
  error$ = this.store.select(selectError)

  searchControl = new FormControl("")
  searchTypeControl = new FormControl("title")
  currentPage = 0
  pageSize = 10
  sortBy = "titre"

  yearControl = new FormControl<number | null>(null);
  showYearFilter = false;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.loadAlbums()
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => this.handleSearch(value)),
      )
      .subscribe()
  }

  private handleSearch(value: string | null): Observable<void> {
    if (value) {
      const searchType = this.searchTypeControl.value
      if (searchType === "title") {
        this.store.dispatch(
          AlbumActions.searchAlbumsByTitle({
            title: value,
            page: this.currentPage,
            size: this.pageSize,
            sortBy: this.sortBy,
          }),
        )
      } else {
        this.store.dispatch(
          AlbumActions.searchAlbumsByArtist({
            artist: value,
            page: this.currentPage,
            size: this.pageSize,
            sortBy: this.sortBy,
          }),
        )
      }
    } else {
      this.loadAlbums()
    }
    return of(undefined)
  }

  availableYears = Array.from(
    { length: 51 },
    (_, i) => new Date().getFullYear() - i
  );

  toggleYearFilter(): void {
    this.showYearFilter = !this.showYearFilter;
  }

  onYearChange(year: number | null): void {
    if (year) {
      this.store.dispatch(
        AlbumActions.filterAlbumsByYear({
          year,
          page: this.currentPage,
          size: this.pageSize,
          sortBy: this.sortBy,
        })
      );
    } else {
      this.loadAlbums();
    }
  }

  clearYearFilter(): void {
    this.yearControl.setValue(null);
    this.loadAlbums();
  }

  loadAlbums() {
    this.store.dispatch(
      AlbumActions.loadAlbums({
        page: this.currentPage,
        size: this.pageSize,
        sortBy: this.sortBy,
      }),
    )
  }

  onPageChange(page: number) {
    this.currentPage = page
    this.loadAlbums()
  }

  onCreateAlbum() {
    this.router.navigate(["/albums/create"])
  }

  onEditAlbum(id: string) {
    this.router.navigate(["/albums/edit", id])
  }

  onDeleteAlbum(id: string) {
    if (confirm("Are you sure you want to delete this album?")) {
      this.store.dispatch(AlbumActions.deleteAlbum({ id }))
    }
  }

  onViewTracks(albumId: string) {
    this.router.navigate(["/albums", albumId])
  }

  protected readonly Array = Array
}

