import { Injectable, inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroment/environment';
import { tap } from 'rxjs';
import { of, throwError } from 'rxjs';

interface JwtResponse {
  access: string;
  refresh: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);
    
    private readonly accessKey = 'access';
    private readonly refreshKey = 'refresh';
    
    private _isLogged = signal<boolean>(false);
    
    public isAuthenticated = computed(() => this._isLogged());

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
        this._isLogged.set(!!localStorage.getItem(this.accessKey));
        }
    }

    login(credentials: any) {
        return this.http.post<JwtResponse>(`${environment.apiUrl}/token/pair`, credentials).pipe(
        tap((response) => this.saveTokens(response))
        );
    }

    registrar(dadosUsuario: any) {
        return this.http.post<any>(`${environment.apiUrl}/registro/`, dadosUsuario);
    }

    logout() {
        if (!isPlatformBrowser(this.platformId)) return;
        
        localStorage.removeItem(this.accessKey);
        localStorage.removeItem(this.refreshKey);
        this._isLogged.set(false);
    }
    
    refreshToken() {
        if (!isPlatformBrowser(this.platformId)) {
            return of({ access: '' });
        }
        
        const refresh = localStorage.getItem(this.refreshKey);
        
        if (!refresh) {
            return throwError(() => new Error('Refresh token não encontrado'));
        }

        return this.http.post<{ access: string }>(`${environment.apiUrl}/token/refresh/`, { refresh }).pipe(
            tap((response) => {
            localStorage.setItem(this.accessKey, response.access);
            })
        );
    }

    private saveTokens(response: JwtResponse) {
        if (!isPlatformBrowser(this.platformId)) return;

        localStorage.setItem(this.accessKey, response.access);
        localStorage.setItem(this.refreshKey, response.refresh);
        this._isLogged.set(true);
    }

    getToken() {
        if (!isPlatformBrowser(this.platformId)) return null;
        return localStorage.getItem(this.accessKey);
    }
}
