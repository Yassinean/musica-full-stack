import { Injectable } from '@angular/core';
import { PlayerState, Track } from "../../models/track.model";
import { BehaviorSubject, Observable } from "rxjs";
import { TrackService} from "../track/track.service";// Import TrackService

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  private readonly audioContext: AudioContext;
  private readonly audioElement: HTMLAudioElement;
  private currentTrack: Track | null = null;
  private currentTrackIndex: number = 0;

  private readonly playerStateSubject: BehaviorSubject<PlayerState> = new BehaviorSubject<PlayerState>(PlayerState.STOPPED);
  public playerState$ = this.playerStateSubject.asObservable();

  private readonly currentTimeSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public currentTime$ = this.currentTimeSubject.asObservable();

  private readonly durationSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public duration$ = this.durationSubject.asObservable();

  private playlist: Track[] = [];

  constructor(private readonly trackService: TrackService) {
    this.audioContext = new AudioContext();
    this.audioElement = new Audio();
    this.setupAudioEventListeners();
  }

  private setupAudioEventListeners(): void {
    this.audioElement.addEventListener('timeupdate', () => {
      this.currentTimeSubject.next(this.audioElement.currentTime * 1000);
    });

    this.audioElement.addEventListener('durationchange', () => {
      this.durationSubject.next(this.audioElement.duration * 1000);
    });

    this.audioElement.addEventListener('ended', () => {
      this.next();
    });

    this.audioElement.addEventListener('error', () => {
      console.error('Audio element error:', this.audioElement.error);
      this.playerStateSubject.next(PlayerState.ERROR);
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
      if (this.currentTrack?.id !== track.id) {
        this.currentTrack = track;
        this.playerStateSubject.next(PlayerState.LOADING);
      }
      await this.audioElement.play();
      this.playerStateSubject.next(PlayerState.PLAYING);
    } catch (error) {
      console.error('Error playing track:', error);
      this.playerStateSubject.next(PlayerState.ERROR);
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
    this.audioElement.volume = Math.max(0, Math.min(1, volume));
  }

  setProgress(timeInMs: number): void {
    if (this.audioElement.duration) {
      this.audioElement.currentTime = timeInMs / 1000;
    }
  }

  async next(): Promise<void> {
    if (!this.playlist.length) return;

    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    const nextTrack = this.playlist[this.currentTrackIndex];
    await this.play(nextTrack);
  }

  async previous(): Promise<void> {
    if (!this.playlist.length) return;

    // If current time is more than 3 seconds, restart the current track
    if (this.audioElement.currentTime > 3) {
      this.audioElement.currentTime = 0;
      return;
    }

    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    const prevTrack = this.playlist[this.currentTrackIndex];
    await this.play(prevTrack);
  }
  loadPlaylist(tracks: Track[]): void {
    this.playlist = tracks;
    this.currentTrackIndex = 0;
    if (tracks.length > 0) {
      this.play(tracks[0]);
    }
  }

  getCurrentTrack(): Track | null {
    return this.currentTrack;
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
    this.audioElement.pause();
    this.audioElement.src = '';
    this.currentTrack = null;
    this.playlist = [];
    this.playerStateSubject.next(PlayerState.STOPPED);
  }
}
