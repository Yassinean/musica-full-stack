// src/app/store/reducers/track.reducer.ts

import { createReducer, on } from '@ngrx/store';
import * as TrackActions from './track.actions';
import { TrackState } from './track.selectors';


export const initialState: TrackState = {
  tracks: [],
  trackPage: null,
  selectedTrack: null,
  loading: false,
  error: null
};
export const trackFeatureKey = 'track';
export const trackReducer = createReducer(
  initialState,
  on(TrackActions.searchTracks, state => ({ ...state, loading: true })),
  on(TrackActions.searchTracksSuccess, (state, { trackPage }) => ({
    ...state,
    trackPage: trackPage,
    tracks: trackPage.content,
    loading: false
  })),
  on(TrackActions.searchTracksFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(TrackActions.searchTracksInAlbum, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TrackActions.searchTracksInAlbumSuccess, (state, { trackPage }) => ({
    ...state,
    trackPage,
    tracks: trackPage.content,
    loading: false,
    error: null
  })),
  on(TrackActions.searchTracksInAlbumFailure, (state, { error }) => ({
    ...state,
    trackPage: null,
    loading: false,
    error
  })),

  on(TrackActions.loadTracksByAlbum, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TrackActions.loadTracksByAlbumSuccess, (state, { trackPage }) => ({
    ...state,
    trackPage,
    loading: false,
    error: null
  })),
  on(TrackActions.loadTracksByAlbumFailure, (state, { error }) => ({
    ...state,
    trackPage: null,
    loading: false,
    error
  })),
  on(TrackActions.loadTrackById, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TrackActions.loadTrackByIdSuccess, (state, { track }) => ({
    ...state,
    selectedTrack: track,
    loading: false,
    error: null
  })),
  on(TrackActions.loadTrackByIdFailure, (state, { error }) => ({
    ...state,
    selectedTrack: null,
    loading: false,
    error
  })),
  on(TrackActions.createTrack, state => ({ ...state, loading: true })),
  on(TrackActions.createTrackSuccess, (state, { track }) => ({
    ...state,
    tracks: [...state.tracks, track],
    loading: false
  })),
  on(TrackActions.createTrackFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(TrackActions.updateTrack, state => ({ ...state, loading: true })),
  on(TrackActions.updateTrackSuccess, (state, { track }) => ({
    ...state,
    tracks: state.tracks.map(t => t.id === track.id ? track : t),
    loading: false
  })),
  on(TrackActions.updateTrackFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(TrackActions.deleteTrack, state => ({ ...state, loading: true })),
  on(TrackActions.deleteTrackSuccess, (state, { id }) => ({
    ...state,
    tracks: state.tracks.filter(track => track.id !== id), // Remove the deleted track
    trackPage: state.trackPage ? {
      ...state.trackPage,
      content: state.trackPage.content.filter(track => track.id !== id) // Remove from paginated list
    } : null,
    loading: false
  })),
  on(TrackActions.deleteTrackFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
