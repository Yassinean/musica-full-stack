import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {of, switchMap} from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as AlbumActions from './album.actions';
import { AlbumService } from '../../../core/services/album/album.service'

@Injectable()
export class AlbumEffects {

  loadAlbums$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlbumActions.loadAlbums),
      mergeMap(({ page, size, sortBy }) =>
        this.albumService.getAlbums(page, size, sortBy).pipe(
          map(albums => AlbumActions.loadAlbumsSuccess({ albums })),
          catchError(error => of(AlbumActions.loadAlbumsFailure({ error: error.message })))
        )
      )
    )
  );


  loadAlbumById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlbumActions.loadAlbumById),
      switchMap(({ id }) =>
        this.albumService.getAlbumById(id).pipe(
          map(album => AlbumActions.loadAlbumByIdSuccess({ album })),
          catchError(error =>
            of(AlbumActions.loadAlbumByIdFailure({ error: error.message }))
          )
        )
      )
    )
  );
  searchByTitle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlbumActions.searchAlbumsByTitle),
      mergeMap(({ title, page, size, sortBy }) =>
        this.albumService.searchByTitle(title, page, size, sortBy).pipe(
          map(albums => AlbumActions.searchAlbumsByTitleSuccess({ albums })),
          catchError(error => of(AlbumActions.searchAlbumsByTitleFailure({ error: error.message })))
        )
      )
    )
  );

  searchByArtist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlbumActions.searchAlbumsByArtist),
      mergeMap(({ artist, page, size, sortBy }) =>
        this.albumService.searchByArtist(artist, page, size, sortBy).pipe(
          map(albums => AlbumActions.searchAlbumsByArtistSuccess({ albums })),
          catchError(error => of(AlbumActions.searchAlbumsByArtistFailure({ error: error.message })))
        )
      )
    )
  );

  filterByYear$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlbumActions.filterAlbumsByYear),
      mergeMap(({ year, page, size, sortBy }) =>
        this.albumService.filterByYear(year, page, size, sortBy).pipe(
          map(albums => AlbumActions.filterAlbumsByYearSuccess({ albums })),
          catchError(error => of(AlbumActions.filterAlbumsByYearFailure({ error: error.message })))
        )
      )
    )
  );

  createAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlbumActions.createAlbum),
      mergeMap(({ album }) =>
        this.albumService.createAlbum(album).pipe(
          map(createdAlbum => AlbumActions.createAlbumSuccess({ album: createdAlbum })),
          catchError(error => of(AlbumActions.createAlbumFailure({ error: error.message })))
        )
      )
    )
  );

  updateAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlbumActions.updateAlbum),
      mergeMap(({ id, album }) =>
        this.albumService.updateAlbum(id, album).pipe(
          map(updatedAlbum => AlbumActions.updateAlbumSuccess({ album: updatedAlbum })),
          catchError(error => of(AlbumActions.updateAlbumFailure({ error: error.message })))
        )
      )
    )
  );

  deleteAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlbumActions.deleteAlbum),
      mergeMap(({ id }) =>
        this.albumService.deleteAlbum(id).pipe(
          map(() => AlbumActions.deleteAlbumSuccess({ id })),
          catchError(error => of(AlbumActions.deleteAlbumFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly albumService: AlbumService
  ) {}
}
