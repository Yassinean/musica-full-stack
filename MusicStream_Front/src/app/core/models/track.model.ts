export interface Track {
  id: string;
  title: string;
  artist: string;
  description?: string;
  addedAt: Date;
  duration: number;
  category: MusicCategory;
  fileUrl: string;
  imageUrl?: string;
  imageFileId: string;
}

export interface SongRequestDTO {
  id: string;
  title: string;
  artist: string;
  description?: string;
  addedAt: Date;
  duration: number;
  category: MusicCategory;
  fileUrl: string;
  imageUrl?: string;
  imageFileId: string;
}
export interface SongResponseDTO {
  id: string;
  title: string;
  artist: string;
  description?: string;
  addedAt: Date;
  duration: number;
  category: MusicCategory;
  fileUrl: string;
  imageUrl?: string;
  imageFileId: string;
}
export enum MusicCategory {
  POP = 'pop',
  ROCK = 'rock',
  RAP = 'rap',
  CHAABI = 'cha3bi',
  OTHER = 'other'
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
