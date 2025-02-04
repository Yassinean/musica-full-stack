import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {selectAlbumById, selectError, selectLoading} from "../../store/album/album.selectors";
import {Store} from "@ngrx/store";
import {ActivatedRoute, Router} from "@angular/router";
import * as AlbumActions from '../../store/album/album.actions';
import {AsyncPipe, NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-album-form',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './album-form.component.html',
  styleUrl: './album-form.component.scss'
})
export class AlbumFormComponent implements OnInit {
  albumForm: FormGroup;
  isEditing = false;
  albumId: string | null = null;
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  currentYear: number = new Date().getFullYear()

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.albumForm = this.fb.group({
      title: ['', [Validators.required]],
      artist: ['', [Validators.required]],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
    });
  }

  ngOnInit() {
    this.albumId = this.route.snapshot.paramMap.get('id');
    if (this.albumId) {
      this.isEditing = true;

      this.store.dispatch(AlbumActions.loadAlbumById({ id: this.albumId }));

      this.store.select(selectAlbumById(this.albumId)).subscribe(album => {
        if (album) {
          this.albumForm.patchValue({
            title: album.title,
            artist: album.artist,
            year: album.year
          });
        }
      });
    }
  }

  onSubmit() {
    if (this.albumForm.valid) {
      if (this.isEditing && this.albumId) {
        this.store.dispatch(AlbumActions.updateAlbum({
          id: this.albumId,
          album: this.albumForm.value
        }));
      } else {
        this.store.dispatch(AlbumActions.createAlbum({
          album: this.albumForm.value
        }));
      }
    }
    this.router.navigate(['/albums']);
  }

  onCancel() {
    this.router.navigate(['/albums']);
  }

  protected readonly Date = new Date().getFullYear();
}
