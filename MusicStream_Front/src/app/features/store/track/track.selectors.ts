import { createFeatureSelector, createSelector } from "@ngrx/store"
import { TrackState } from "./track.reducer"

export const selectTrackState = createFeatureSelector<TrackState>("track")

export const selectAllTracks = createSelector(selectTrackState, (state: TrackState) => state?.tracks ?? [])

export const selectTracksLoading = createSelector(selectTrackState, (state: TrackState) => state?.loading ?? false)

export const selectTracksError = createSelector(selectTrackState, (state: TrackState) => state?.error ?? null)

export const selectTracks = createSelector(selectTrackState, (state: TrackState) => state?.tracks ?? [])

export const selectAlbumTracks = createSelector(selectTracks, (tracks) => tracks)

