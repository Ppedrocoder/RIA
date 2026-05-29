import { Injectable, Input, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';
import { Tipo, Arte, Forms } from '../app';


@Injectable({
  providedIn: 'root',
})
export class Service {
    private readonly storageKey = 'atelie-artes';
    tipos = signal<Tipo[]>([]);
    artes = signal<Arte[]>([]);
    formModel = signal<Forms>({ 
      id: undefined,
      name: '', 
      tipo: null, 
      description: '',
      foto: '' 
    });
  
    formAtelie = form(this.formModel, (schemaPath) => {
      required(schemaPath.name, {message: 'O nome é obrigatório.'});
      required(schemaPath.tipo, {message: 'O tipo é obrigatório.'});
      required(schemaPath.description, {message: 'A descrição é obrigatória.'});
      required(schemaPath.foto, {message: 'A foto é obrigatória.'});
    });
  
  private nextId = 1;
  
  getArtes() {
    return this.artes();
  }

  getTipos() {
    return this.tipos();
  }

  setTipos(tipos: Tipo[]) {
    this.tipos.set(tipos);
  }

  getFormModel() {
    return this.formAtelie;
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
  save() {
    const form = this.formModel();
    const arteToSave: Arte = {
      id: form.id,
      name: form.name,
      tipo: form.tipo?.name ?? '',
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
    this.resetForm();
  }

  edit(arte: Arte) {
    this.formModel.set({
      id: arte.id,
      name: arte.name,
      tipo: this.tipos().find((t) => t.name === arte.tipo) ?? null,
      description: arte.description,
      foto: arte.foto
    });
  }

  delete(id?: number) {
    if (!id) return;

    this.artes.set(this.artes().filter((arte) => arte.id !== id));
    this.persistArtes();
  }

  resetForm() {
    this.formModel.set({
      id: undefined,
      name: '',
      tipo: null,
      description: '',
      foto: ''
    });
  }

  private persistArtes() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.artes()));
  }
}
