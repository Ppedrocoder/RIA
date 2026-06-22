import { Injectable, signal } from '@angular/core';
import { Arte } from '../app';


@Injectable({
  providedIn: 'root',
})
export class ArteService {
  artes = signal<Arte[]>([]);
  
  private nextId = 1;
  
  getArtes() {
    return this.artes();
  }
  getArteById(id?: number) {
    if (!id) return null;
    return this.artes().find((arte) => arte.id === id) || null;
  }
  loadArtes() {
    const storedArtes = localStorage.getItem(this.storageKey);

    if (!storedArtes) {
      this.artes.set([]);
      this.nextId = 1;
      return;
    }

    try {
      this.artes.set(JSON.parse(storedArtes) as Arte[]);
      const current = this.artes();
      this.nextId = current.reduce((maxId, arte) => Math.max(maxId, arte.id ?? 0), 0) + 1;
    } catch {
      this.artes.set([]);
      this.nextId = 1;
    }
  }
  save(arteToSave: Arte) {
    const current = this.artes();
    if (arteToSave.id !== undefined) {
      this.artes.set(current.map((arte) => (arte.id === arteToSave.id ? { ...arte, ...arteToSave } : arte)));
    } else {
      this.artes.set([...current, { ...arteToSave, id: this.nextId }]);
      this.nextId += 1;
    }

    this.persistArtes();
  }

  delete(id?: number) {
    if (!id) return;

    this.artes.set(this.artes().filter((arte) => arte.id !== id));
    this.persistArtes();
  }

  private persistArtes() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.artes()));
  }
}
