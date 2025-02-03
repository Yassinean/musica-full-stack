import {ApplicationConfig, isDevMode} from '@angular/core';
import {provideRouter, withViewTransitions} from '@angular/router';

import {routes} from './app.routes';
import {MetaReducer, provideStore} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {TrackEffects} from "./features/store/track/track.effects";
import {trackFeatureKey, trackReducer} from "./features/store/track/track.reducer";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideImageKitLoader} from "@angular/common";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "./interceptors/auth.interceptors";
import {authReducer} from "./features/store/auth/auth.reducer";
import {AuthEffects} from "./features/store/auth/auth.effects";
import {albumReducer} from "./features/store/album/album.reducer";
import {AlbumEffects} from "./features/store/album/album.effects";
import {localStorageSync} from "ngrx-store-localstorage";
import {LoggingInterceptor} from "./interceptors/logging.interceptors";

export function localStorageSyncReducer(reducer: any): any {
  return localStorageSync({ keys: ['auth'], rehydrate: true })(reducer);
}

const metaReducers: MetaReducer[] = [localStorageSyncReducer];

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    provideRouter(routes , withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({[trackFeatureKey]: trackReducer, auth: authReducer  , albums: albumReducer} ,
      { metaReducers }
    ),
    provideEffects([TrackEffects , AuthEffects , AlbumEffects ]),
    provideAnimations(),
    provideImageKitLoader('https://res.cloudinary.com/dz4pww2qv'),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    })
  ]
};
