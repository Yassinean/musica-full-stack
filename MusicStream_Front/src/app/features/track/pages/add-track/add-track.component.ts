import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {createTrack, loadTrackById, updateTrack} from "../../../store/track/track.actions";
import {selectSelectedTrack, selectTrackError, selectTrackLoading} from "../../../store/track/track.selectors";
import { Track, MusicCategory } from 'src/app/core/models/track.model';
import {TrackService} from "../../../../core/services/track/track.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-add-track',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule
  ],
  templateUrl: './add-track.component.html',
  styleUrls: ['./add-track.component.scss']
})
export class AddTrackComponent implements OnInit, OnDestroy {
  trackForm: FormGroup;
  categories: string[] = Object.values(MusicCategory);
  selectedFile: File | null = null;
  error$: Observable<string | null>;
  loading$: Observable<boolean>;
  albumId: string | undefined;
  trackId: string | null = null; // Track ID for edit mode
  isEditMode = false;
  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly trackService: TrackService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {

    this.trackForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(100)],
      duree: [{ value: null, disabled: true }], // Disabled as it will be auto-calculated
      trackNumber: [{ value: null, disabled: true }],
      category: [null],
      albumId: ['']
    });

    this.error$ = this.store.select(selectTrackError);
    this.loading$ = this.store.select(selectTrackLoading);
  }

  ngOnInit() {
    this.albumId = this.route.snapshot.paramMap.get("id") ?? "";
    this.trackId = this.route.snapshot.paramMap.get("trackId") ?? null;

    if (this.trackId) {
      // Edit mode: Load the track details
      this.isEditMode = true;
      this.store.dispatch(loadTrackById({ id: this.trackId }));

      this.subscription.add(
        this.store.select(selectSelectedTrack).subscribe((track) => {
          if (track) {
            this.trackForm.patchValue({
              title: track.title,
              description: track.description,
              duree: track.duree,
              trackNumber: track.trackNumber,
              category: track.category?.valueOf(),
              albumId: track.albumId
            });
            console.log('Track  Data:', track.category);
          }
        })
      );
    } else {
      // Add mode: Generate a new track number
      this.trackForm.patchValue({
        albumId: this.albumId,
        trackNumber: this.generateTrackNumber()
      });
    }

  }
  private generateTrackNumber(): number {
    // Generate a unique number based on current timestamp
    return Date.now() % 1000000; // Use last 6 digits of timestamp
  }

  onSubmit(): void {
    if (this.trackForm.valid && this.selectedFile) {
      // Enable disabled controls before getting form value
      this.trackForm.get('duree')?.enable();
      this.trackForm.get('trackNumber')?.enable();

      const trackData: Track = this.trackForm.value;
      console.log('Submitting Track Data:', trackData);
      console.log('Selected File:', this.selectedFile);

      if (this.isEditMode && this.trackId) {
        // Dispatch update action
        this.store.dispatch(updateTrack({
          id: this.trackId,
          track: trackData,
          audioFile: this.selectedFile
        }));
      } else if (this.selectedFile) {
        // Dispatch create action
        this.store.dispatch(createTrack({
          track: trackData,
          audioFile: this.selectedFile
        }));
      }
      // Disable controls again
      this.trackForm.get('duree')?.disable();
      this.trackForm.get('trackNumber')?.disable();
    } else {
      Object.keys(this.trackForm.controls).forEach(key => {
        const control = this.trackForm.get(key);
        control?.markAsTouched();
      });
    }
    this.subscription.add(
      this.store.select(selectTrackLoading).subscribe((loading) => {
        if (!loading) {
          this.router.navigate(["/albums", this.albumId]);
        }
      })
    );
  }


  private async getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          audio.src = e.target.result as string;
        }
      };

      audio.onloadedmetadata = () => {
        const durationInMs = Math.round(audio.duration * 1000);
        URL.revokeObjectURL(audio.src); // Clean up
        resolve(durationInMs);
      };

      audio.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  async onFileSelected(event: Event): Promise<void> {
    const element = event.target as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const allowedFormats = ['audio/mpeg', 'audio/wav'];
      const maxSize = 10 * 1024 * 1024; // 10 MB

      if (!allowedFormats.includes(file.type)) {
        alert('Invalid file format. Only MP3 and WAV files are allowed.');
        this.selectedFile = null;
        return;
      }

      if (file.size > maxSize) {
        alert('File size exceeds 10 MB.');
        this.selectedFile = null;
        return;
      }
      try {
        const duration = await this.getAudioDuration(file);

        this.trackForm.patchValue({
          duree: duration
        });

        this.selectedFile = file;
      } catch (error) {
        console.error('Error getting audio duration:', error);
        alert('Error reading audio file. Please try again.');
        this.selectedFile = null;
      }
    } else {
      this.selectedFile = null;
    }
  }

  onCancel(): void {

    this.trackForm.reset();
    this.selectedFile = null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
