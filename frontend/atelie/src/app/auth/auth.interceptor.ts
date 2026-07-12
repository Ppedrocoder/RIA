import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

const AUTH_ENDPOINTS = ['/token/', '/token/refresh/'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isAuthEndpoint = AUTH_ENDPOINTS.some(path => req.url.endsWith(path));


  if (isAuthEndpoint) {
    return next(req);
  }

  const auth = inject(AuthService);
  const token = auth.getToken();

  
  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }


  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
    
      if (error.status === 401) {
        
       
        return auth.refreshToken().pipe(
          switchMap((response) => {
           
            const newAuthReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.access}`
              }
            });
           
            return next(newAuthReq);
          }),
          catchError((refreshError) => {
            
            auth.logout();
            return throwError(() => refreshError);
          })
        ) || throwError(() => error); 
       
      }

     
      return throwError(() => error);
    })
  );
};
