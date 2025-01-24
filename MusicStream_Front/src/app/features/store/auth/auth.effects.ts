import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Router} from "@angular/router";
import {AuthService} from "../../../core/services/auth/auth.service";
import * as AuthActions from './auth.action';
import {catchError, map, mergeMap, of, tap} from "rxjs";


@Injectable()
export class AuthEffects {

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({username, password}) =>
        this.authService.login(username, password).pipe(
          map((response) => {
            console.log('Login Response:', response); // Debug log
            const authorities = Array.isArray(response.authorities)
              ? response.authorities
              : [];
            return AuthActions.loginSuccess({
              token: response.token,
              username: response.username,
              authorities: authorities.map((auth: any) => auth.authority),
            });
          }),
          catchError(error => {
            console.error('Login Error:', error);
            return of(AuthActions.loginFailure({
              error: error.error?.message || error.message || 'Login failed'
            }))
          })
        )
      )
    )
  );


  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ username, password, roles }) =>
        this.authService.register(username, password, roles).pipe(
          map((response) => {
            const authorities = Array.isArray(response.authorities)
              ? response.authorities
              : [];

            return AuthActions.registerSuccess({
              token: response.token,
              username: response.username,
              authorities: authorities.map((auth: any) => auth.authority),
            });
          }),
          catchError((error) => {
            let errorMessage = 'Registration failed';

            if (error.status === 409) {
              errorMessage = error.error.message || 'Username already exists';
            } else if (error.error && error.error.message) {
              errorMessage = error.error.message;
            }

            return of(AuthActions.registerFailure({ error: errorMessage }));
          })
        )
      )
    )
  );


  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(() => of(AuthActions.logoutSuccess()))
        )
      )
    )
  );

  authSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
        tap(action => {
          console.log('Auth Success Action:', action); // Debug log
          localStorage.setItem('token', action.token);
          this.router.navigate(['/albums']).then(
            success => console.log('Navigation result:', success),
            error => console.error('Navigation error:', error)
          );
        })
      ),
    { dispatch: false }
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
  }

}
