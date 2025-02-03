import {Component, OnDestroy, OnInit} from "@angular/core";
import {BehaviorSubject, combineLatest, Observable, Subject, Subscription, takeUntil} from "rxjs";
import {Store} from "@ngrx/store";
import {ActivatedRoute, Router} from "@angular/router";
import {selectAlbumDetails, selectError, selectLoading} from "../../store/album/album.selectors";
import * as AlbumActions from "../../store/album/album.actions";
import * as TrackActions from "../../store/track/track.actions";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {selectAlbumTracks, selectTrackPage} from "../../store/track/track.selectors";
import {Album} from "../../../core/models/album.model";
import {PlayerState, Track, TrackPage} from "../../../core/models/track.model";
import {selectIsAdmin} from "../../store/auth/auth.selectors";
import {AuthState} from "../../store/auth/auth.reducer";
import {AudioPlayerService} from "../../../core/services/audio-player/audio-player.service";
import {map} from "rxjs/operators";

@Component({
  selector: "app-album-details",
  standalone: true,
  imports: [NgIf, AsyncPipe, NgForOf, NgClass],
  templateUrl: "./album-details.component.html",
  styleUrl: "./album-details.component.scss",
})
export class AlbumDetailsComponent implements OnInit, OnDestroy {
  // Make PlayerState enum available in template
  PlayerState = PlayerState;

  // Store selectors
  albumDetails$: Observable<Album | null>;
  albumTracks$: Observable<Track[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  isAdmin$: Observable<boolean>;
  private readonly trackPageSubject = new BehaviorSubject<TrackPage | null>(null);
  trackPage$ = this.trackPageSubject.asObservable();
  private readonly subscription = new Subscription();

  albumId: string | null = null;

  // Audio player observables
  playerState$: Observable<PlayerState>;
  currentTime$: Observable<number>;
  duration$: Observable<number>;
  formattedCurrentTime$: Observable<number>;
  formattedDuration$: Observable<number>;

  // Component state
  currentTrack: Track | null = null;
  currentPage = 0;
  pageSize = 10;
  private readonly destroy$ = new Subject<void>();

  private readonly searchTermSubject = new BehaviorSubject<string>("");
  searchTerm$ = this.searchTermSubject.asObservable();


  constructor(
    private readonly store: Store,
    private readonly storeAuth: Store<{ auth: AuthState }>,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    protected readonly audioPlayerService: AudioPlayerService
  ) {
    // Initialize store selectors
    this.albumDetails$ = this.store.select(selectAlbumDetails);
    this.albumTracks$ = this.store.select(selectAlbumTracks);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
    this.isAdmin$ = this.storeAuth.select(selectIsAdmin);
    this.trackPage$ = this.store.select(selectTrackPage);

    // Initialize audio player observables
    this.playerState$ = this.audioPlayerService.playerState$;
    this.currentTime$ = this.audioPlayerService.currentTime$.pipe(
      map(time => time ?? 0) // Use nullish coalescing
    );
    this.duration$ = this.audioPlayerService.duration$.pipe(
      map(duration => duration ?? 0) // Use nullish coalescing
    );

    // Initialize formatted time observables with guaranteed number values
    this.formattedCurrentTime$ = this.currentTime$.pipe(
      map(time => Math.max(0, time)) // Ensure positive number
    );
    this.formattedDuration$ = this.duration$.pipe(
      map(duration => Math.max(0, duration)) // Ensure positive number
    );
    this.subscription.add(
      this.audioPlayerService.currentTrack$.subscribe((track) => {
        if (track) {
          this.currentTrack = track
        }
      }),
    );
    // Debug subscriptions
    this.setupDebugSubscriptions();
  }

  private setupDebugSubscriptions(): void {
    this.albumDetails$.pipe(takeUntil(this.destroy$)).subscribe((album) => {
      console.log("Album Details:", album);
    });

    this.albumTracks$.pipe(takeUntil(this.destroy$)).subscribe((tracks) => {
      console.log("Album Tracks:", tracks);
    });

    combineLatest([this.albumDetails$, this.albumTracks$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([album, tracks]) => {
        console.log("Combined State:", {album, tracks});
      });
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const albumId: string = params["id"];
      if (albumId) {
        this.store.dispatch(AlbumActions.loadAlbumById({id: albumId}));
        this.store.dispatch(
          TrackActions.loadTracksByAlbum({
            albumId,
            page: 0,
            size: 10,
            sortBy: "title",
          })
        );

        this.searchTerm$.pipe(takeUntil(this.destroy$)).subscribe((searchTerm) => {
          this.store.dispatch(
            TrackActions.searchTracksInAlbum({
              albumId,
              title: searchTerm,
              page: 0,
              size: 10,
              sortBy: "title",
            })
          );
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.audioPlayerService.destroy();
    this.subscription.unsubscribe();
  }

  async onPlayTrack(track: Track): Promise<void> {
    try {
      if (this.currentTrack?.id === track.id) {
        if (this.audioPlayerService.getPlayerState() === PlayerState.PLAYING) {
          this.audioPlayerService.pause();
        } else {
          await this.audioPlayerService.play(track);
        }
      } else {
        this.currentTrack = track;
        await this.audioPlayerService.play(track);

        this.subscription.add(
          this.trackPage$.subscribe(trackPage => {
            if (trackPage?.content) {
              this.audioPlayerService.loadPlaylist(trackPage.content);
            }
          })
        );
      }
    } catch (error) {
      console.error('Error playing track:', error);
    }
  }

  getProgressPercentage(current: number, total: number): number {
    if (!total || !current) return 0;
    return Math.min(100, (current / total) * 100);
  }

  safeFormatTime(ms: number | null): string {
    if (ms === null) return '0:00';
    return this.formatTime(ms);
  }

  onPauseTrack(): void {
    this.audioPlayerService.pause();
  }

  onPreviousTrack(): void {
    this.audioPlayerService.previous();
  }

  onNextTrack(): void {
    this.audioPlayerService.next();
  }

  onSeek(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    if (!isNaN(value)) {
      this.audioPlayerService.setProgress(value);
    }
  }

  // Update the onVolumeChange method to handle null values
  onVolumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    if (!isNaN(value) && value >= 0 && value <= 1) {
      this.audioPlayerService.setVolume(value);
    }
  }

  formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getPageNumbers(totalPages: number): number[] {
    return Array.from({length: totalPages}, (_, i) => i);
  }

  onEditAlbum(id: string): void {
    this.router.navigate(["/albums/edit", id]);
  }

  onAddTrack(albumId: string): void {
    this.router.navigate(["/albums", albumId, "add-track"]);
  }

  onDeleteTrack(trackId: string): void {
    if (confirm("Are you sure you want to delete this track?")) {
      this.store.dispatch(TrackActions.deleteTrack({id: trackId}));
    }
  }

  onEditTrack(trackId: string): void {
    this.albumId = this.route.snapshot.paramMap.get("id") ?? "";
    this.router.navigate(["/albums", this.albumId, "edit-track", trackId]);
  }

  onBackToList(): void {
    this.router.navigate(["/albums"]);
  }


  loadMoreTracks(page: number): void {
    this.currentPage = page;
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const albumId = params["id"];
      this.store.dispatch(
        TrackActions.loadTracksByAlbum({
          albumId,
          page,
          size: this.pageSize,
          sortBy: "title",
        })
      );
    });
  }

  changeSorting(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const albumId = params["id"];
      console.log("Changing sort:", {albumId, sortBy: target.value});
      this.store.dispatch(
        TrackActions.loadTracksByAlbum({
          albumId,
          page: 0,
          size: 10,
          sortBy: target.value,
        })
      );
    });
  }

  onSearchTracks(event: Event): void {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.trim();
    this.searchTermSubject.next(searchTerm);
  }
}
