import {createReducer, on} from "@ngrx/store";
import {Album, PageResponse} from "../../../core/models/album.model";
import * as AlbumActions from './album.actions';

export interface AlbumState {
  albums: PageResponse<Album> | null;
  loading: boolean;
  error: string | null;
  selectedAlbum: Album | null;
}

export const initialState: AlbumState = {
  albums: null,
  loading: false,
  error: null,
  selectedAlbum: null
};

export const albumReducer = createReducer(
  initialState,

  // Load Albums
  on(AlbumActions.loadAlbums, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AlbumActions.loadAlbumsSuccess, (state, { albums }) => ({
    ...state,
    albums,
    loading: false,
    error: null
  })),
  on(AlbumActions.loadAlbumsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Search by Title
  on(AlbumActions.searchAlbumsByTitle, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AlbumActions.searchAlbumsByTitleSuccess, (state, { albums }) => ({
    ...state,
    albums,
    loading: false,
    error: null
  })),
  on(AlbumActions.searchAlbumsByTitleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Search by Artist
  on(AlbumActions.searchAlbumsByArtist, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AlbumActions.searchAlbumsByArtistSuccess, (state, { albums }) => ({
    ...state,
    albums,
    loading: false,
    error: null
  })),
  on(AlbumActions.searchAlbumsByArtistFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Filter by Year
  on(AlbumActions.filterAlbumsByYear, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AlbumActions.filterAlbumsByYearSuccess, (state, { albums }) => ({
    ...state,
    albums,
    loading: false,
    error: null
  })),
  on(AlbumActions.filterAlbumsByYearFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Load Album by ID
  on(AlbumActions.loadAlbumById, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AlbumActions.loadAlbumByIdSuccess, (state, { album }) => ({
    ...state,
    selectedAlbum: album,
    loading: false,
    error: null
  })),
  on(AlbumActions.loadAlbumByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Create Album
  on(AlbumActions.createAlbum, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AlbumActions.createAlbumSuccess, (state, { album }) => ({
    ...state,
    loading: false,
    error: null,
    selectedAlbum: album
  })),
  on(AlbumActions.createAlbumFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Album
  on(AlbumActions.updateAlbum, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AlbumActions.updateAlbumSuccess, (state, { album }) => ({
    ...state,
    loading: false,
    error: null,
    selectedAlbum: album
  })),
  on(AlbumActions.updateAlbumFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Album
  on(AlbumActions.deleteAlbum, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AlbumActions.deleteAlbumSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    error: null,
    albums: state.albums ? {
      ...state.albums,
      content: state.albums.content.filter(album => album.id !== id)
    } : null
  })),
  on(AlbumActions.deleteAlbumFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Reset State
  on(AlbumActions.resetAlbumState, () => ({
    ...initialState
  })),

  // Set Action Success
  on(AlbumActions.setActionSuccess, (state, { success }) => ({
    ...state,
    actionSuccess: success
  })),

);
