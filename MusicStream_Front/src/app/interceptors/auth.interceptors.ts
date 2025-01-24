import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { switchMap, take } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  if (req.url.includes('/auth/') || req.method === 'OPTIONS') {
    return next(req);
  }

  return store.select(state => state['auth']?.token).pipe(
    take(1),
    switchMap(token => {
      if (token) {
        console.log('Token being sent:', token); // Debug log
        const authReq = req.clone({
          setHeaders: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Request headers:', authReq.headers.keys()); // Debug log
        return next(authReq);
      }
      return next(req);
    })
  );
};
