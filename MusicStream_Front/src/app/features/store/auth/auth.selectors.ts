import { createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import {jwtDecode} from "jwt-decode";

export const selectAuthState = (state: { auth: AuthState }) => state.auth;

export const selectIsAdmin = createSelector(
  selectAuthState,
  (authState: AuthState) => {
    if (!authState.token) return false;
    try {
      const decodedToken: any = jwtDecode(authState.token);
      const userRoles: string[] =
        decodedToken.roles || decodedToken.authorities || [];
      return userRoles.includes('ROLE_ADMIN');
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }
);