import { Component } from '@angular/core';

import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { ClickOutsideDirective } from "../../../../shared/click-outside.directive";
import { TrackSearchPipe } from "../../../../shared/pipe/track-search.pipe";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-library-list',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgForOf,
    ClickOutsideDirective,
    TrackSearchPipe,
    FormsModule,

  ],
  templateUrl: './library-list.component.html',
  styleUrls: ['./library-list.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ]),
      transition(':leave', [
        animate('200ms ease-in',
          style({ opacity: 0, transform: 'translateY(-20px)' })
        )
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('300ms ease-out',
              style({ opacity: 1, transform: 'translateY(0)' })
            )
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class LibraryListComponent {

}
