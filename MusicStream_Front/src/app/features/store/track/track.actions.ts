// src/app/store/actions/track.actions.ts

import { createAction, props } from '@ngrx/store';
import { Track, TrackPage } from 'src/app/core/models/track.model';

export const loadTracks = createAction(
  '[Track] Load Tracks',
  props<{ page: number; size: number; sortBy: string }>()
);

export const loadTracksSuccess = createAction(
  '[Track] Load Tracks Success',
  props<{ trackPage: TrackPage }>()
);

export const loadTracksFailure = createAction(
  '[Track] Load Tracks Failure',
  props<{ error: any }>()
);

export const searchTracks = createAction(
  '[Track] Search Tracks',
  props<{ title: string; page: number; size: number; sortBy: string }>()
);

export const searchTracksSuccess = createAction(
  '[Track] Search Tracks Success',
  props<{ trackPage: TrackPage }>()
);

export const searchTracksFailure = createAction(
  '[Track] Search Tracks Failure',
  props<{ error: any }>()
);
// Add these to your existing track.actions.ts

export const searchTracksInAlbum = createAction(
  '[Track] Search Tracks In Album',
  props<{
    albumId: string;
    title: string;
    page: number;
    size: number;
    sortBy: string
  }>()
);

export const searchTracksInAlbumSuccess = createAction(
  '[Track] Search Tracks In Album Success',
  props<{ trackPage: TrackPage }>()
);

export const searchTracksInAlbumFailure = createAction(
  '[Track] Search Tracks In Album Failure',
  props<{ error: any }>()
);
export const loadTracksByAlbum = createAction(
  '[Track] Load Tracks By Album',
  props<{ albumId: string; page: number; size: number; sortBy: string }>()
);

export const loadTracksByAlbumSuccess = createAction(
  '[Track] Load Tracks By Album Success',
  props<{ trackPage: TrackPage }>()
);

export const loadTracksByAlbumFailure = createAction(
  '[Track] Load Tracks By Album Failure',
  props<{ error: any }>()
);

export const createTrack = createAction(
  '[Track] Create Track',
  props<{ track: Track; audioFile: File }>()
);

export const createTrackSuccess = createAction(
  '[Track] Create Track Success',
  props<{ track: Track }>()
);

export const createTrackFailure = createAction(
  '[Track] Create Track Failure',
  props<{ error: any }>()
);

export const updateTrack = createAction(
  '[Track] Update Track',
  props<{ id: string; track: Track; audioFile: File | undefined }>()
);

export const updateTrackSuccess = createAction(
  '[Track] Update Track Success',
  props<{ track: Track }>()
);

export const updateTrackFailure = createAction(
  '[Track] Update Track Failure',
  props<{ error: any }>()
);

export const deleteTrack = createAction(
  '[Track] Delete Track',
  props<{ id: string }>()
);

export const deleteTrackSuccess = createAction(
  '[Track] Delete Track Success',
  props<{ id: string }>()
);

export const deleteTrackFailure = createAction(
  '[Track] Delete Track Failure',
  props<{ error: any }>()
);

export const loadTrackById = createAction(
  '[Track] Load Track By Id',
  props<{ id: string }>()
);

export const loadTrackByIdSuccess = createAction(
  '[Track] Load Track By Id Success',
  props<{ track: Track }>()
);

export const loadTrackByIdFailure = createAction(
  '[Track] Load Track By Id Failure',
  props<{ error: any }>()
);
