import { Injectable, signal } from '@angular/core';
import { TipoArte } from '../app';

@Injectable({
  providedIn: 'root',
})
export class TipoArteService {
    tipos = signal<TipoArte[]>([]);

    getTipos() {
    return this.tipos();
    }

    setTipos(tipos: TipoArte[]) {
      this.tipos.set(tipos);
    }
}
