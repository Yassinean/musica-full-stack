import { createReducer, on } from "@ngrx/store"
import type { SongResponseDTO} from "../../../core/models/track.model";
import * as TrackActions from "./track.actions"

export interface TrackState {
  tracks: SongResponseDTO[]
  loading: boolean
  error: string | null
}

export const initialState: TrackState = {
  tracks: [],
  loading: false,
  error: null,
}

export const trackReducer = createReducer(
  initialState,
  on(TrackActions.loadTracks, (state) => ({ ...state, loading: true })),
  on(TrackActions.loadTracksSuccess, (state, { tracks }) => ({
    ...state,
    tracks,
    loading: false,
    error: null,
  })),
  on(TrackActions.loadTracksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TrackActions.searchTracks, (state) => ({ ...state, loading: true })),
  on(TrackActions.searchTracksSuccess, (state, { tracks }) => ({
    ...state,
    tracks,
    loading: false,
    error: null,
  })),
  on(TrackActions.searchTracksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TrackActions.loadTracksByAlbum, (state) => ({ ...state, loading: true })),
  on(TrackActions.loadTracksByAlbumSuccess, (state, { tracks }) => ({
    ...state,
    tracks,
    loading: false,
    error: null,
  })),
  on(TrackActions.loadTracksByAlbumFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TrackActions.createTrack, (state) => ({ ...state, loading: true })),
  on(TrackActions.createTrackSuccess, (state, { track }) => ({
    ...state,
    tracks: [...state.tracks, track],
    loading: false,
    error: null,
  })),
  on(TrackActions.createTrackFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TrackActions.updateTrack, (state) => ({ ...state, loading: true })),
  on(TrackActions.updateTrackSuccess, (state, { track }) => ({
    ...state,
    tracks: state.tracks.map((t) => (t.id === track.id ? track : t)),
    loading: false,
    error: null,
  })),
  on(TrackActions.updateTrackFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TrackActions.deleteTrack, (state) => ({ ...state, loading: true })),
  on(TrackActions.deleteTrackSuccess, (state, { id }) => ({
    ...state,
    tracks: state.tracks.filter((t) => t.id !== id),
    loading: false,
    error: null,
  })),
  on(TrackActions.deleteTrackFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
)

