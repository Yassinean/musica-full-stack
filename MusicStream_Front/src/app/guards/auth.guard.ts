import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AuthState } from '../features/store/auth/auth.reducer';
import { take } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Observable, of } from 'rxjs';

export const AuthGuard = (requiredRoles: string[] = []): Observable<boolean> => {
  const store = inject(Store<{ auth: AuthState }>);
  const router = inject(Router);


  return store.select(state => state.auth).pipe(
    take(1),
    map(authState => {
      console.log('Auth State in Guard:', authState);


      if (!authState.isAuthenticated || !authState.token) {
        router.navigate(['/auth/login']);
        return false;
      }

      try {
        const token = authState.token;
        const decodedToken: any = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);

        // Extract roles from the decoded token
        const userRoles: string[] =
          decodedToken.roles ||
          decodedToken.authorities ||
          decodedToken.scope?.split(' ') ||
          [];

        console.log('User Roles:', userRoles);



        // Check if the user has the required roles for the requested route
        const hasAccess = requiredRoles.length === 0 || requiredRoles.some(role => userRoles.includes(role));

        if (hasAccess) {
          return true;
        } else {
          router.navigate(['/unauthorized']);
          return false;
        }
      } catch (error) {
        console.error('Error decoding token:', error);

        // Redirect user to login page if token decoding fails
        router.navigate(['/auth/login']);
        return false;
      }
    })
  );
};
