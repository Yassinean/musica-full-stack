import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, switchMap, take } from 'rxjs';
import { Album, PageResponse } from 'src/app/core/models/album.model';
import * as AlbumActions from './album.actions';
import { selectAlbums } from './album.selectors';

@Injectable({
  providedIn: 'root',
})
export class AlbumResolver implements Resolve<PageResponse<Album>> {
  constructor(private readonly store: Store) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<PageResponse<Album>> {
    const page = +route.queryParams['page'] || 0;
    const size = +route.queryParams['size'] || 10;
    const sortBy = route.queryParams['sortBy'] || 'titre';

    // Dispatch action to load albums if needed
    this.store.dispatch(AlbumActions.loadAlbums({ page, size, sortBy }));

    // Wait for the albums to be loaded from the store
    return this.store.select(selectAlbums).pipe(
      take(1), // Take the first emitted value from the store
      switchMap((albums) => {
        // If no albums are found or the content is empty, return a fallback with all necessary properties
        if (!albums || !albums.content || albums.content.length === 0) {
          return of({
            content: [],
            totalElements: 0,
            totalPages: 0, // You can assume zero pages if there's no data
            size: size, // Size should match the requested page size
            number: page, // Current page number
          } as PageResponse<Album>);
        }

        // Return the loaded albums
        return of(albums);
      })
    );
  }
}
