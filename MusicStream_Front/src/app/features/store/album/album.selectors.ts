import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AlbumState } from './album.reducer';

// Feature Selector
export const selectAlbumState = createFeatureSelector<AlbumState>('albums');

// Selectors
export const selectAlbums = createSelector(
  selectAlbumState,
  (state: AlbumState) => state.albums
);

export const selectLoading = createSelector(
  selectAlbumState,
  (state: AlbumState) => state.loading
);

// Selector for error state
export const selectError = createSelector(
  selectAlbumState,
  (state: AlbumState) => state.error
);

export const selectAlbumsContent = createSelector(
  selectAlbums,
  (albums) => albums?.content || []
);

export const selectAlbumsTotalElements = createSelector(
  selectAlbums,
  (albums) => albums?.totalElements || 0
);

export const selectAlbumsLoading = createSelector(
  selectAlbumState,
  (state: AlbumState) => state.loading
);

export const selectAlbumsError = createSelector(
  selectAlbumState,
  (state: AlbumState) => state.error
);

export const selectSelectedAlbum = createSelector(
  selectAlbumState,
  (state: AlbumState) => state.selectedAlbum
);

export const selectAlbumById = (id: string) =>
  createSelector(selectAlbumsContent, (albums) =>
    albums.find(album => album.id === id)
  );
export const selectAlbumDetails = createSelector(selectAlbumState, (state: AlbumState) => state.selectedAlbum)
