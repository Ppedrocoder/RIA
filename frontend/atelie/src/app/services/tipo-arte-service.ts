import { Injectable, signal } from '@angular/core';
import { TipoArte } from '../app';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TipoArteService {
    tipos = signal<TipoArte[]>([]);
    private apiUrl = 'http://localhost:8000/api/logica/tiposarte';
    constructor(private http: HttpClient){}

    getTipos() {
      return this.tipos();
    }

    loadTipos() {
      return this.http.get<TipoArte[]>(this.apiUrl).subscribe((data) => {
        this.tipos.set(data);
      });
    }

}
