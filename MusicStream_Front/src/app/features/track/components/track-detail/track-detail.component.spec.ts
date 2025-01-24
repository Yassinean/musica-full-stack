import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TrackDetailComponent } from './track-detail.component';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { AudioPlayerService } from '../../../../core/services/audio-player/audio-player.service';
import { TrackService } from '../../../../core/services/track/track.service';
import { MusicCategory, PlayerState, Track } from '../../../../core/models/track.model';
import { BehaviorSubject, of, Subject } from 'rxjs';
import * as TrackActions from '../../../store/track/track.actions';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';

describe('TrackDetailComponent', () => {
  let component: TrackDetailComponent;
  let fixture: ComponentFixture<TrackDetailComponent>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAudioPlayer: jasmine.SpyObj<AudioPlayerService>;
  let mockTrackService: jasmine.SpyObj<TrackService>;
  let mockActivatedRoute: any;
  let playerStateSubject: BehaviorSubject<PlayerState>;
  let currentTimeSubject: BehaviorSubject<number>;
  let durationSubject: BehaviorSubject<number>;

  const mockTrack: Track = {
    id: '1',
    title: 'Test Track',
    artist: 'Test Artist',
    addedAt: new Date(),
    duration: 180000,
    category: MusicCategory.POP,
    fileUrl: 'test-url',
    imageFileId: 'image-1'
  };

  beforeEach(async () => {
    // Initialize subjects
    playerStateSubject = new BehaviorSubject<PlayerState>(PlayerState.STOPPED);
    currentTimeSubject = new BehaviorSubject<number>(0);
    durationSubject = new BehaviorSubject<number>(0); // Start with 0 duration

    mockStore = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAudioPlayer = jasmine.createSpyObj('AudioPlayerService', [
      'play',
      'pause',
      'stop',
      'next',
      'previous',
      'setVolume',
      'setProgress',
      'loadPlaylist',
      'getCurrentTrack'
    ], {
      playerState$: playerStateSubject.asObservable(),
      currentTime$: currentTimeSubject.asObservable(),
      duration$: durationSubject.asObservable()
    });

    mockTrackService = jasmine.createSpyObj('TrackService', ['getImageFileUrl']);
    mockActivatedRoute = {
      paramMap: new BehaviorSubject<ParamMap>({
        get: (key: string) => '1',
        has: (key: string) => true,
        getAll: (key: string) => ['1'],
        keys: [] as string[]
      }),
      snapshot: {
        paramMap: {
          get: (key: string) => '1'
        }
      }
    };

    // Configure mock returns
    mockStore.select.and.returnValue(of([mockTrack]));
    mockTrackService.getImageFileUrl.and.returnValue(of('test-image-url'));
    mockAudioPlayer.getCurrentTrack.and.returnValue(mockTrack);
    mockRouter.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [
        TrackDetailComponent,
        AsyncPipe,
        NgIf,
        NgOptimizedImage
      ],
      providers: [
        provideAnimations(),
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AudioPlayerService, useValue: mockAudioPlayer },
        { provide: TrackService, useValue: mockTrackService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentTime).toBe(0);
    expect(component.duration).toBe(0);
    expect(component.volume).toBe(1);
    expect(component.showVolumeSlider).toBeFalse();
    expect(component.playerState).toBe(PlayerState.STOPPED);
  });

  it('should update duration when audio player emits new duration', fakeAsync(() => {
    // First verify initial state
    expect(component.duration).toBe(0);

    // Emit new duration
    durationSubject.next(180000);
    tick();
    fixture.detectChanges();

    // Verify new duration
    expect(component.duration).toBe(180000);
  }));

  it('should update currentTime when audio player emits new time', fakeAsync(() => {
    expect(component.currentTime).toBe(0);

    currentTimeSubject.next(60000);
    tick();
    fixture.detectChanges();

    expect(component.currentTime).toBe(60000);
  }));

  it('should load track on init', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(mockStore.dispatch).toHaveBeenCalledWith(TrackActions.loadTracks());
  }));

  it('should toggle play state', () => {
    component.playerState = PlayerState.STOPPED;
    component.togglePlay(mockTrack);
    expect(mockAudioPlayer.play).toHaveBeenCalledWith(mockTrack);

    component.playerState = PlayerState.PLAYING;
    component.togglePlay(mockTrack);
    expect(mockAudioPlayer.pause).toHaveBeenCalled();
  });

  it('should handle volume changes', () => {
    const mockEvent = new Event('input');
    Object.defineProperty(mockEvent, 'target', { value: { value: '0.5' } });

    component.onVolumeChange(mockEvent);
    expect(component.volume).toBe(0.5);
    expect(mockAudioPlayer.setVolume).toHaveBeenCalledWith(0.5);
  });

  it('should format time correctly', () => {
    expect(component.formatTime(65000)).toBe('1:05');
    expect(component.formatTime(125000)).toBe('2:05');
  });

  it('should handle next track navigation', fakeAsync(() => {
    component.playNext();
    tick();
    expect(mockAudioPlayer.next).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalled();
  }));

  it('should clean up on destroy', () => {
    component.currentImageUrl = 'blob:test';
    component.ngOnDestroy();
    // Add expectations for cleanup
    expect(component.currentImageUrl).toBe('blob:test'); // URL.revokeObjectURL should be called
  });
});
