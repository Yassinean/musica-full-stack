import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryListComponent } from './library-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AudioPlayerService } from '../../../../core/services/audio-player/audio-player.service';
import { TrackService } from '../../../../core/services/track/track.service';
import { of } from 'rxjs';
import { PlayerState } from '../../../../core/models/track.model';

describe('LibraryListComponent', () => {
  let component: LibraryListComponent;
  let fixture: ComponentFixture<LibraryListComponent>;
  let mockStore: MockStore;
  let mockAudioPlayerService: jasmine.SpyObj<AudioPlayerService>;
  let mockTrackService: jasmine.SpyObj<TrackService>;

  const initialState = {
    tracks: {
      tracks: [],
      selectedTrack: null,
      error: null,
      loading: false,
      selectedCategory: null,
      imageLoadErrors: {}
    }
  };

  beforeEach(async () => {
    mockAudioPlayerService = jasmine.createSpyObj('AudioPlayerService', ['play'], {
      playerState$: of(PlayerState.STOPPED)
    });

    mockTrackService = jasmine.createSpyObj('TrackService', ['getImageFileUrl']);
    mockTrackService.getImageFileUrl.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [
        LibraryListComponent,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: AudioPlayerService, useValue: mockAudioPlayerService },
        { provide: TrackService, useValue: mockTrackService }
      ]
    }).compileComponents();

    mockStore = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tracks on init', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should handle image errors', () => {
    const trackId = 'test-track';
    const event = new Event('error');
    const dispatchSpy = spyOn(mockStore, 'dispatch');

    component.handleImageError(trackId, event);

    expect(dispatchSpy).toHaveBeenCalled();
    expect(component['imageLoadError'].value[trackId]).toBeTruthy();
  });

  it('should return default cover image for tracks without image URL', () => {
    const track = { id: 'test-track' };
    const result = component.getTrackImage(track as any);
    expect(result).toBe(component['defaultCoverImage']);
  });
});
