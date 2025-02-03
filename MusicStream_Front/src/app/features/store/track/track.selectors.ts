import { createFeatureSelector, createSelector } from '@ngrx/store';
import {Track, TrackPage} from '../../../core/models/track.model';
import {selectAlbumsContent} from "../album/album.selectors";

export interface TrackState {
  tracks: Track[];
  trackPage: TrackPage | null;
  selectedTrack: Track | null;
  loading: boolean;
  error: string | null;
}

export const selectTrackState = createFeatureSelector<TrackState>('track');

export const selectTracks = createSelector(
  selectTrackState,
  (state: TrackState) => state?.tracks ?? []
);

export const selectAlbumTracks = createSelector(
  selectTracks,
  (tracks: Track[]) => tracks ?? []
);

export const selectTrackLoading = createSelector(
  selectTrackState,
  (state: TrackState) => state?.loading ?? false
);

export const selectTrackError = createSelector(
  selectTrackState,
  (state: TrackState) => state?.error ?? null
);

export const selectTrackPage = createSelector(
  selectTrackState,
  (state: TrackState) => state.trackPage
);

export const selectSelectedTrack = createSelector(
  selectTrackState,
  (state) => state.selectedTrack
);
