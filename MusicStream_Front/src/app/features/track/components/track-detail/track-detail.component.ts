import {Component} from '@angular/core';
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";


@Component({
  selector: 'app-track-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './track-detail.component.html',
  styleUrl: './track-detail.component.scss'
})
export class TrackDetailComponent {

}
