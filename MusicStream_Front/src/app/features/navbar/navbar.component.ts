import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {Store} from "@ngrx/store";
import * as AuthActions from "../store/auth/auth.action"

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent {
  constructor(private readonly store: Store) {}

  logout() {
    this.store.dispatch(AuthActions.logout())
  }

}
