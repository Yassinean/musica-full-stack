import {Component, Inject, OnInit} from '@angular/core';
import {NavbarComponent} from "./features/navbar/navbar.component";
import {filter} from "rxjs";
import {CommonModule, NgIf} from "@angular/common";
import {Router, NavigationEnd, type Event, RouterOutlet} from "@angular/router"

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet, NavbarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'MusicStream';
  showNavbar = true;

  constructor(@Inject(Router) private readonly router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showNavbar = !["/auth/login", "/auth/register"].includes(event.urlAfterRedirects);
      });
  }
}
