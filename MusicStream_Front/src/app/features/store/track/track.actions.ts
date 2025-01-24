import { createAction, props } from "@ngrx/store"
import {SongRequestDTO, SongResponseDTO} from "../../../core/models/track.model";


export const loadTracks = createAction("[Track] Load Tracks", props<{ page: number; size: number; sortBy: string }>())

export const loadTracksSuccess = createAction("[Track] Load Tracks Success", props<{ tracks: SongResponseDTO[] }>())

export const loadTracksFailure = createAction("[Track] Load Tracks Failure", props<{ error: string }>())

export const searchTracks = createAction(
  "[Track] Search Tracks",
  props<{ title: string; page: number; size: number; sortBy: string }>(),
)

export const searchTracksSuccess = createAction("[Track] Search Tracks Success", props<{ tracks: SongResponseDTO[] }>())

export const searchTracksFailure = createAction("[Track] Search Tracks Failure", props<{ error: string }>())

export const loadTracksByAlbum = createAction(
  "[Track] Load Tracks By Album",
  props<{ albumId: string; page: number; size: number; sortBy: string }>(),
)

export const loadTracksByAlbumSuccess = createAction(
  "[Track] Load Tracks By Album Success",
  props<{ tracks: SongResponseDTO[] }>(),
)

export const loadTracksByAlbumFailure = createAction("[Track] Load Tracks By Album Failure", props<{ error: string }>())

export const createTrack = createAction("[Track] Create Track", props<{ track: SongRequestDTO }>())

export const createTrackSuccess = createAction("[Track] Create Track Success", props<{ track: SongResponseDTO }>())

export const createTrackFailure = createAction("[Track] Create Track Failure", props<{ error: string }>())

export const updateTrack = createAction("[Track] Update Track", props<{ id: string; track: SongRequestDTO }>())

export const updateTrackSuccess = createAction("[Track] Update Track Success", props<{ track: SongResponseDTO }>())

export const updateTrackFailure = createAction("[Track] Update Track Failure", props<{ error: string }>())

export const deleteTrack = createAction("[Track] Delete Track", props<{ id: string }>())

export const deleteTrackSuccess = createAction("[Track] Delete Track Success", props<{ id: string }>())

export const deleteTrackFailure = createAction("[Track] Delete Track Failure", props<{ error: string }>())

