// src/app/store/effects/track.effects.ts

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as TrackActions from './track.actions';
import { TrackService } from 'src/app/core/services/track/track.service';

@Injectable()
export class TrackEffects {
  loadTracks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.loadTracks),
      mergeMap(({ page, size, sortBy }) =>
        this.trackService.getAllTracks(page, size, sortBy).pipe(
          map(trackPage => TrackActions.loadTracksSuccess({ trackPage })),
          catchError(error => of(TrackActions.loadTracksFailure({ error })))
        )
      )
    )
  );

  searchTracks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.searchTracks),
      mergeMap(({ title, page, size, sortBy }) =>
        this.trackService.searchTracks(title, page, size, sortBy).pipe(
          map(trackPage => TrackActions.searchTracksSuccess({ trackPage })),
          catchError(error => of(TrackActions.searchTracksFailure({ error })))
        )
      )
    )
  );

  searchTracksInAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.searchTracksInAlbum),
      mergeMap(({ albumId, title, page, size, sortBy }) =>
        this.trackService.searchSongsByTitleInAlbum(albumId, title, page, size, sortBy).pipe(
          map((trackPage) =>
            TrackActions.searchTracksInAlbumSuccess({ trackPage })
          ),
          catchError((error) =>
            of(TrackActions.searchTracksInAlbumFailure({ error }))
          )
        )
      )
    )
  );

  loadTracksByAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.loadTracksByAlbum),
      mergeMap(({ albumId, page, size, sortBy }) =>
        this.trackService.getTracksByAlbum(albumId, page, size, sortBy).pipe(
          map(trackPage => TrackActions.loadTracksByAlbumSuccess({ trackPage })),
          catchError(error => of(TrackActions.loadTracksByAlbumFailure({ error })))
        )
      )
    )
  );

  createTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.createTrack),
      mergeMap(({ track, audioFile }) =>
        this.trackService.createTrack(track, audioFile).pipe(
          map(createdTrack => TrackActions.createTrackSuccess({ track: createdTrack })),
          catchError(error => of(TrackActions.createTrackFailure({ error })))
        )
      )
    )
  );

  updateTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.updateTrack),
      mergeMap(({ id, track, audioFile }) =>
        this.trackService.updateTrack(id, track, audioFile).pipe(
          map(updatedTrack => TrackActions.updateTrackSuccess({ track: updatedTrack })),
          catchError(error => of(TrackActions.updateTrackFailure({ error })))
        )
      )
    )
  );

  deleteTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.deleteTrack),
      mergeMap(({ id }) =>
        this.trackService.deleteTrack(id).pipe(
          map(() => TrackActions.deleteTrackSuccess({ id })),
          catchError(error => of(TrackActions.deleteTrackFailure({ error })))
        )
      )
    )
  );

  loadTrackById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.loadTrackById),
      mergeMap(({ id }) =>
        this.trackService.getTrackById(id).pipe(
          map((track) => TrackActions.loadTrackByIdSuccess({ track })),
          catchError((error) => of(TrackActions.loadTrackByIdFailure({ error })))
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly trackService: TrackService
  ) {}
}
