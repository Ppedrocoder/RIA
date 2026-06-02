import { Injectable, signal } from '@angular/core';
import { Arte, TipoArte } from '../app';


@Injectable({
  providedIn: 'root',
})
export class arteService {
  private readonly storageKey = 'atelie-artes';
  artes = signal<Arte[]>([]);
  
  private nextId = 1;
  
  getArtes() {
    return this.artes();
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
  save(formModel: any) {
    const form = formModel();
    const arteToSave: Arte = {
      id: form.id,
      name: form.name,
      tipoarte: form.tipoarte?.name ?? '',
      description: form.description,
      foto: form.foto
    };

    const current = this.artes();
    if (arteToSave.id) {
      this.artes.set(current.map((arte) => (arte.id === arteToSave.id ? { ...arteToSave } : arte)));
    } else {
      this.artes.set([...current, { ...arteToSave, id: this.nextId }]);
      this.nextId += 1;
    }

    this.persistArtes();
    this.resetForm(formModel);
  }

  edit(arte: Arte, formModel: any, tipos: TipoArte[]) {
    formModel.set({
      id: arte.id,
      name: arte.name,
      tipoarte: tipos.find((t) => t.name === arte.tipoarte) ?? null,
      description: arte.description,
      foto: arte.foto
    });
  }

  delete(id?: number) {
    if (!id) return;

    this.artes.set(this.artes().filter((arte) => arte.id !== id));
    this.persistArtes();
  }

  resetForm(formModel: any) {
    formModel.set({
      id: undefined,
      name: '',
      tipoarte: null,
      description: '',
      foto: ''
    });
  }

  private persistArtes() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.artes()));
  }
}
