import { Routes } from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'library',
    loadComponent: () =>
      import('./features/library/pages/library-page/library-page.component').then(m => m.LibraryPageComponent),
    canActivate: [() => AuthGuard(['ROLE_USER','ROLE_ADMIN'])],
  },
  {
    path: 'track/:id',
    loadComponent: () =>
      import('./features/track/components/track-detail/track-detail.component').then(m => m.TrackDetailComponent),
    canActivate: [() => AuthGuard(['ROLE_USER', 'ROLE_ADMIN'])],
  },
  {
    path: 'albums',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/album/album-list/album-list.component')
            .then(m => m.AlbumListComponent),
        canActivate: [() => AuthGuard(['ROLE_USER', 'ROLE_ADMIN'])]
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./features/album/album-form/album-form.component')
            .then(m => m.AlbumFormComponent),
        canActivate: [() => AuthGuard(['ROLE_ADMIN'])],
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./features/album/album-form/album-form.component')
            .then(m => m.AlbumFormComponent),
        canActivate: [() => AuthGuard(['ROLE_ADMIN'])],
      },
      {
        path: ":id",
        loadComponent: () =>
          import("./features/album/album-details/album-details.component").then((m) => m.AlbumDetailsComponent),
        canActivate: [() => AuthGuard(["ROLE_USER", "ROLE_ADMIN"])],
      },
      {
        path: ":id/add-track",
        loadComponent: () =>
          import("./features/track/pages/add-track/add-track.component").then((m) => m.AddTrackComponent),
        canActivate: [() => AuthGuard(["ROLE_ADMIN"])],
      },
      {
        path: ":id/edit-track/:trackId", // Add this route for editing
        loadComponent: () =>
          import("./features/track/pages/add-track/add-track.component").then((m) => m.AddTrackComponent),
        canActivate: [() => AuthGuard(["ROLE_ADMIN"])],
      },
    ]
  },
  { path: '**', redirectTo: 'auth/login' },
  {
    path: '',
    redirectTo: 'albums',
    pathMatch: 'full'
  }
];
