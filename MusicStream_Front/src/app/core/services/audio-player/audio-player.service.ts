import { Injectable } from '@angular/core';
import { PlayerState, Track } from "../../models/track.model";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  private readonly audioContext: AudioContext;
  private readonly audioElement: HTMLAudioElement;
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  currentTrack$ = this.currentTrackSubject.asObservable();
  private currentTrackIndex: number = 0;

  private readonly playerStateSubject = new BehaviorSubject<PlayerState>(PlayerState.STOPPED);
  public playerState$ = this.playerStateSubject.asObservable();

  private readonly currentTimeSubject = new BehaviorSubject<number>(0);
  public currentTime$ = this.currentTimeSubject.asObservable();

  private readonly durationSubject = new BehaviorSubject<number>(0);
  public duration$ = this.durationSubject.asObservable();

  private readonly volumeSubject = new BehaviorSubject<number>(1);
  public volume$ = this.volumeSubject.asObservable();

  private readonly isShuffleSubject = new BehaviorSubject<boolean>(false);
  public isShuffle$ = this.isShuffleSubject.asObservable();

  private readonly isRepeatSubject = new BehaviorSubject<boolean>(false);
  public isRepeat$ = this.isRepeatSubject.asObservable();

  private playlist: Track[] = [];
  private shuffledPlaylist: Track[] = [];

  constructor(private readonly http: HttpClient) {
    this.audioContext = new AudioContext();
    this.audioElement = new Audio();
    this.setupAudioEventListeners();
    this.loadVolumeFromStorage();
  }

  private getAuthToken(): string {
    return localStorage.getItem('token') ?? '';
  }

  private loadVolumeFromStorage(): void {
    const savedVolume = localStorage.getItem('audio-player-volume');
    if (savedVolume) {
      const volume = parseFloat(savedVolume);
      this.setVolume(volume);
    }
  }

  private setupAudioEventListeners(): void {
    this.audioElement.addEventListener('timeupdate', () => {
      this.currentTimeSubject.next(this.audioElement.currentTime * 1000);
    });

    this.audioElement.addEventListener('durationchange', () => {
      this.durationSubject.next(this.audioElement.duration * 1000);
    });

    this.audioElement.addEventListener('ended', () => {
      if (this.isRepeatSubject.value) {
        this.audioElement.currentTime = 0;
        this.audioElement.play();
      } else {
        this.next();
      }
    });

    this.audioElement.addEventListener('error', () => {
      console.error('Audio element error:', this.audioElement.error);
      this.playerStateSubject.next(PlayerState.ERROR);
      this.next(); // Automatically try next track on error
    });

    this.audioElement.addEventListener('waiting', () => {
      this.playerStateSubject.next(PlayerState.BUFFERING);
    });

    this.audioElement.addEventListener('canplay', () => {
      if (this.playerStateSubject.value === PlayerState.BUFFERING) {
        this.playerStateSubject.next(PlayerState.PLAYING);
      }
    });
  }

  async play(track: Track): Promise<void> {
    try {
      if (this.currentTrackSubject.value?.id !== track.id) {
        this.currentTrackSubject.next(track);
        this.playerStateSubject.next(PlayerState.LOADING);

        if (track.audioFileId) {
          const response = await fetch(
            `${environment.apiUrl}/api/user/songs/stream/${track.audioFileId}`,
            {
              headers: {
                'Authorization': `Bearer ${this.getAuthToken()}`
              }
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const contentType = response.headers.get('content-type');
          const arrayBuffer = await response.arrayBuffer();
          const blob = new Blob([arrayBuffer], { type: contentType || 'audio/mpeg' });

          // Clean up old blob URL
          if (this.audioElement.src.startsWith('blob:')) {
            URL.revokeObjectURL(this.audioElement.src);
          }

          const blobUrl = URL.createObjectURL(blob);
          this.audioElement.src = blobUrl;
          await this.audioElement.load();
        } else {
          throw new Error('No audio file ID available');
        }
      }

      await this.audioElement.play();
      this.playerStateSubject.next(PlayerState.PLAYING);
    } catch (error) {
      console.error('Error playing track:', error);
      this.playerStateSubject.next(PlayerState.ERROR);
      throw error; // Re-throw to handle in component
    }
  }

  pause(): void {
    this.audioElement.pause();
    this.playerStateSubject.next(PlayerState.PAUSED);
  }

  stop(): void {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.playerStateSubject.next(PlayerState.STOPPED);
  }

  setVolume(volume: number): void {
    const safeVolume = Math.max(0, Math.min(1, volume));
    this.audioElement.volume = safeVolume;
    this.volumeSubject.next(safeVolume);
    localStorage.setItem('audio-player-volume', safeVolume.toString());
  }

  setProgress(timeInMs: number): void {
    if (this.audioElement.duration) {
      const safeTime = Math.max(0, Math.min(timeInMs, this.audioElement.duration * 1000));
      this.audioElement.currentTime = safeTime / 1000;
    }
  }

  toggleShuffle(): void {
    const newShuffleState = !this.isShuffleSubject.value;
    this.isShuffleSubject.next(newShuffleState);

    if (newShuffleState) {
      this.shufflePlaylist();
    } else {
      this.currentTrackIndex = this.playlist.findIndex(
        track => track.id === this.currentTrackSubject.value?.id
      );
    }
  }

  toggleRepeat(): void {
    this.isRepeatSubject.next(!this.isRepeatSubject.value);
  }

  private shufflePlaylist(): void {
    this.shuffledPlaylist = [...this.playlist]
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    // Ensure current track is first
    if (this.currentTrackSubject.value) {
      const currentIndex = this.shuffledPlaylist.findIndex(
        track => track.id === this.currentTrackSubject.value?.id
      );
      if (currentIndex > -1) {
        this.shuffledPlaylist.splice(currentIndex, 1);
        this.shuffledPlaylist.unshift(this.currentTrackSubject.value);
      }
    }
  }

  async next(): Promise<void> {
    if (!this.playlist.length) return;

    const currentPlaylist = this.isShuffleSubject.value ? this.shuffledPlaylist : this.playlist;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % currentPlaylist.length;
    const nextTrack = currentPlaylist[this.currentTrackIndex];

    try {
      await this.play(nextTrack);
    } catch (error) {
      console.error('Error playing next track:', error);
      if (this.currentTrackIndex < currentPlaylist.length - 1) {
        await this.next(); // Try next track if available
      }
    }
  }

  async previous(): Promise<void> {
    if (!this.playlist.length) return;

    if (this.audioElement.currentTime > 3) {
      this.audioElement.currentTime = 0;
      return;
    }

    const currentPlaylist = this.isShuffleSubject.value ? this.shuffledPlaylist : this.playlist;
    this.currentTrackIndex = (this.currentTrackIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    const prevTrack = currentPlaylist[this.currentTrackIndex];

    try {
      await this.play(prevTrack);
    } catch (error) {
      console.error('Error playing previous track:', error);
      if (this.currentTrackIndex > 0) {
        await this.previous(); // Try previous track if available
      }
    }
  }

  loadPlaylist(tracks: Track[]): void {
    this.playlist = tracks;
    if (this.isShuffleSubject.value) {
      this.shufflePlaylist();
    }
    const currentIndex = this.playlist.findIndex(
      track => track.id === this.currentTrackSubject.value?.id
    );
    if (currentIndex !== -1) {
      this.currentTrackIndex = currentIndex;
    }
  }

  getCurrentTrack(): Track | null {
    return this.currentTrackSubject.value;
  }

  getCurrentTime(): number {
    return this.audioElement.currentTime * 1000;
  }

  getDuration(): number {
    return this.audioElement.duration * 1000;
  }

  getPlayerState(): PlayerState {
    return this.playerStateSubject.value;
  }

  destroy(): void {
    if (this.audioElement.src.startsWith('blob:')) {
      URL.revokeObjectURL(this.audioElement.src);
    }
    this.audioElement.pause();
    this.audioElement.src = '';
    this.currentTrackSubject.next(null);
    this.playlist = [];
    this.shuffledPlaylist = [];
    this.playerStateSubject.next(PlayerState.STOPPED);
    this.currentTimeSubject.next(0);
    this.durationSubject.next(0);
  }
}
