export interface Track {
  id?: string;
  title: string;
  description?: string;
  duree: number;
  trackNumber: number;
  albumId: string;
  category?: MusicCategory;
  audioFileId: string;
}

export interface TrackPage {
  content: Track[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export enum MusicCategory {
  POP = 'POP',
  ROCK = 'ROCK',
  RAP = 'RAP',
  CHAABI = 'CHAABI',
  OTHER = 'OTHER'
}

export enum PlayerState {
  PLAYING = 'playing',
  PAUSED = 'paused',
  BUFFERING = 'buffering',
  STOPPED = 'stopped',
  LOADING = 'loading',
  ERROR = 'error',
  SUCCESS = 'success'
}
