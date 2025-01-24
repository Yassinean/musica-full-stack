import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { of } from "rxjs"
import { catchError, map, mergeMap } from "rxjs/operators"
import { TrackService} from "../../../core/services/track/track.service";
import * as TrackActions from "./track.actions"

@Injectable()
export class TrackEffects {
  loadTracks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.loadTracks),
      mergeMap(({ page, size, sortBy }) =>
        this.trackService.getAllTracks(page, size, sortBy).pipe(
          map((tracks) => TrackActions.loadTracksSuccess({ tracks })),
          catchError((error) => of(TrackActions.loadTracksFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  searchTracks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.searchTracks),
      mergeMap(({ title, page, size, sortBy }) =>
        this.trackService.searchTracksByTitle(title, page, size, sortBy).pipe(
          map((tracks) => TrackActions.searchTracksSuccess({ tracks })),
          catchError((error) => of(TrackActions.searchTracksFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  loadTracksByAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.loadTracksByAlbum),
      mergeMap(({ albumId, page, size, sortBy }) =>
        this.trackService.getTracksByAlbumId(albumId, page, size, sortBy).pipe(
          map((tracks) => TrackActions.loadTracksByAlbumSuccess({ tracks })),
          catchError((error) => of(TrackActions.loadTracksByAlbumFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  createTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.createTrack),
      mergeMap(({ track }) =>
        this.trackService.createTrack(track).pipe(
          map((createdTrack) => TrackActions.createTrackSuccess({ track: createdTrack })),
          catchError((error) => of(TrackActions.createTrackFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  updateTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.updateTrack),
      mergeMap(({ id, track }) =>
        this.trackService.updateTrack(id, track).pipe(
          map((updatedTrack) => TrackActions.updateTrackSuccess({ track: updatedTrack })),
          catchError((error) => of(TrackActions.updateTrackFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  deleteTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.deleteTrack),
      mergeMap(({ id }) =>
        this.trackService.deleteTrack(id).pipe(
          map(() => TrackActions.deleteTrackSuccess({ id })),
          catchError((error) => of(TrackActions.deleteTrackFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  constructor(
    private readonly actions$: Actions,
    private readonly trackService: TrackService,
  ) {}
}

