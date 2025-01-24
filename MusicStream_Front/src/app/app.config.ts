import {ApplicationConfig} from '@angular/core';
import {provideRouter, withViewTransitions} from '@angular/router';

import {routes} from './app.routes';
import {MetaReducer, provideStore} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {TrackEffects} from "./features/store/track/track.effects";
import {trackReducer} from "./features/store/track/track.reducer";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideImageKitLoader} from "@angular/common";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "./interceptors/auth.interceptors";
import {authReducer} from "./features/store/auth/auth.reducer";
import {AuthEffects} from "./features/store/auth/auth.effects";
import {albumReducer} from "./features/store/album/album.reducer";
import {AlbumEffects} from "./features/store/album/album.effects";
import {localStorageSync} from "ngrx-store-localstorage";

export function localStorageSyncReducer(reducer: any): any {
  return localStorageSync({ keys: ['auth'], rehydrate: true })(reducer);
}

const metaReducers: MetaReducer[] = [localStorageSyncReducer];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes , withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({tracks: trackReducer, auth: authReducer  , albums: albumReducer} ,
      { metaReducers }
    ),
    provideEffects([TrackEffects , AuthEffects , AlbumEffects ]),
    provideAnimations(),
    provideImageKitLoader('https://res.cloudinary.com/dz4pww2qv')]
};
