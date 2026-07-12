import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const auth = inject(AuthService);
  const router = inject(Router);

  return toObservable(auth.isAuthenticated).pipe(
    take(1), 
    map((isLogged) => {
      if (isLogged) {
        return true;
      }
      
      return router.createUrlTree(['/login']);
    })
  );
};
