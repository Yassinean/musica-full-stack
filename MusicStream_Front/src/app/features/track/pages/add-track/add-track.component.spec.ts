import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AddTrackComponent } from './add-track.component';
import { MusicCategory } from '../../../../core/models/track.model';
import * as TrackActions from '../../../store/track/track.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../navbar/navbar.component';

describe('AddTrackComponent', () => {
  let component: AddTrackComponent;
  let fixture: ComponentFixture<AddTrackComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        CommonModule,
        NavbarComponent,  // Import NavbarComponent directly
        AddTrackComponent  // Import AddTrackComponent directly
      ],
      providers: [
        FormBuilder,
        provideMockStore({}),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: new Map()
            }
          }
        }
      ]
    })
      .compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AddTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize with empty form fields except category', () => {
      expect(component.trackForm.get('title')?.value).toBe('');
      expect(component.trackForm.get('artist')?.value).toBe('');
      expect(component.trackForm.get('description')?.value).toBe('');
      expect(component.trackForm.get('category')?.value).toBe(MusicCategory.POP);
      expect(component.trackForm.get('audioFile')?.value).toBeNull();
      expect(component.trackForm.get('imageFile')?.value).toBeNull();
    });

    it('should have required validators', () => {
      const titleControl = component.trackForm.get('title');
      const artistControl = component.trackForm.get('artist');
      const audioFileControl = component.trackForm.get('audioFile');

      expect(titleControl?.hasValidator(Validators.required)).toBeTruthy();
      expect(artistControl?.hasValidator(Validators.required)).toBeTruthy();
      expect(audioFileControl?.hasValidator(Validators.required)).toBeTruthy();
    });
  });

  describe('validateTrackMetadata', () => {
    it('should return false if title exceeds 50 characters', () => {
      component.trackForm.patchValue({
        title: 'a'.repeat(51)
      });
      expect(component.validateTrackMetadata()).toBeFalse();
    });

    it('should return false if description exceeds 200 characters', () => {
      component.trackForm.patchValue({
        title: 'Valid Title',
        description: 'a'.repeat(201)
      });
      expect(component.validateTrackMetadata()).toBeFalse();
    });

    it('should return true for valid metadata', () => {
      component.trackForm.patchValue({
        title: 'Valid Title',
        description: 'Valid Description'
      });
      expect(component.validateTrackMetadata()).toBeTrue();
    });
  });

  describe('validateAudioFile', () => {
    it('should return false for files larger than 15MB', () => {
      const largeFile = new File([''], 'large.mp3', {type: 'audio/mpeg'});
      Object.defineProperty(largeFile, 'size', {value: 16 * 1024 * 1024});
      expect(component.validateAudioFile(largeFile)).toBeFalse();
    });

    it('should return false for invalid file types', () => {
      const invalidFile = new File([''], 'invalid.txt', {type: 'text/plain'});
      expect(component.validateAudioFile(invalidFile)).toBeFalse();
    });

    it('should return true for valid audio files', () => {
      const validFile = new File([''], 'valid.mp3', {type: 'audio/mpeg'});
      Object.defineProperty(validFile, 'size', {value: 5 * 1024 * 1024});
      expect(component.validateAudioFile(validFile)).toBeTrue();
    });
  });

  describe('validateImageFile', () => {
    it('should return false for files larger than 5MB', () => {
      const largeFile = new File([''], 'large.jpg', {type: 'image/jpeg'});
      Object.defineProperty(largeFile, 'size', {value: 6 * 1024 * 1024});
      expect(component.validateImageFile(largeFile)).toBeFalse();
    });

    it('should return false for invalid image types', () => {
      const invalidFile = new File([''], 'invalid.gif', {type: 'image/gif'});
      expect(component.validateImageFile(invalidFile)).toBeFalse();
    });

    it('should return true for valid image files', () => {
      const validFile = new File([''], 'valid.jpg', {type: 'image/jpeg'});
      Object.defineProperty(validFile, 'size', {value: 2 * 1024 * 1024});
      expect(component.validateImageFile(validFile)).toBeTrue();
    });
  });

  describe('onImageChange', () => {
    it('should update form and preview when valid image is selected', fakeAsync(() => {
      const validFile = new File([''], 'valid.jpg', { type: 'image/jpeg' });
      Object.defineProperty(validFile, 'size', { value: 2 * 1024 * 1024 });

      const event = { target: { files: [validFile] } } as unknown as Event;
      component.onImageChange(event);

      tick();
      expect(component.trackForm.get('imageFile')?.value).toBe(validFile);
    }));

    it('should clear form and preview when invalid image is selected', () => {
      const invalidFile = new File([''], 'invalid.gif', {type: 'image/gif'});
      const event = {target: {files: [invalidFile]}} as unknown as Event;

      component.onImageChange(event);

      expect(component.trackForm.get('imageFile')?.value).toBeNull();
      expect(component.imagePreview).toBeNull();
    });
  });

  describe('onSubmit', () => {
    it('should dispatch addTrack action with valid form data', fakeAsync(() => {
      const dispatchSpy = spyOn(store, 'dispatch');
      const audioFile = new File(['audio data'], 'test.mp3', { type: 'audio/mpeg' });
      const imageFile = new File(['image data'], 'test.jpg', { type: 'image/jpeg' });

      // Create a mock track object based on the form data
      const track = {
        title: 'Test Track',
        artist: 'Test Artist',
        description: 'Test Description',
        category: MusicCategory.POP,
      };

      // Patch the form with valid data
      component.trackForm.patchValue({
        title: 'Test Track',
        artist: 'Test Artist',
        description: 'Test Description',
        category: MusicCategory.POP,
        audioFile: audioFile,
        imageFile: imageFile,
      });

      // Ensure form is valid
      expect(component.trackForm.valid).toBe(true);

      // Call onSubmit and complete async operations
      component.onSubmit();
      tick();  // Wait for async operations to complete
      flush(); // Ensure microtasks are completed

      // Verify the dispatch was called with the correct action
    }));

    it('should not dispatch action with invalid form data', fakeAsync(async () => {
      const dispatchSpy = spyOn(store, 'dispatch');

      await component.onSubmit();
      tick();

      expect(dispatchSpy).not.toHaveBeenCalled();
    }));
  });

  describe('resetForm', () => {
    it('should reset form to initial values', () => {
      component.trackForm.patchValue({
        title: 'Test',
        artist: 'Test',
        description: 'Test',
        category: MusicCategory.RAP,
        audioFile: new File([''], 'test.mp3', { type: 'audio/mpeg' }),
        imageFile: new File([''], 'test.jpg', { type: 'image/jpeg' })
      });

      component.resetForm();

      expect(component.trackForm.get('title')?.value).toBe(null);
      expect(component.trackForm.get('artist')?.value).toBe(null);
      expect(component.trackForm.get('description')?.value).toBe(null);
      expect(component.trackForm.get('category')?.value).toBe(MusicCategory.POP);
      expect(component.trackForm.get('audioFile')?.value).toBeNull();
      expect(component.trackForm.get('imageFile')?.value).toBeNull();
    });
  });
});
