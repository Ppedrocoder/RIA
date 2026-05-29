import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { form, FormField, required } from '@angular/forms/signals';
import { List } from './list/list';
import { Form } from './form/form';


interface Tipo {
  name: string;
}
interface Arte{
  id?: number;
  name: string;
  tipo: Tipo | string;
  description: string;
  foto: string;
}

interface Forms {
  id?: number;
  name: string;
  tipo: Tipo | null;
  description: string;
  foto: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, InputTextModule, IftaLabelModule, ButtonModule, CardModule, SelectModule, DividerModule, FormField, Form, List],
  template: ` 
  <p-divider align="center" class="mb-4">
    <h2 class="text-4xl font-bold m-4">Ateliê Potiguar</h2>
  </p-divider>
  <app-form [formAtelie]="formAtelie" [tipos]="tipos" (save)="save()" (resetForm)="resetForm()"></app-form>
  <app-list [artes]="artes" (edit)="edit($event)" (delete)="delete($event)"></app-list>
  <p-divider align="center" class="mt-4">
    <h2 class="text-2xl font-bold m-4">Feito por: Pedro Ricardo</h2>
  </p-divider>
  `,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('atelie');
  private readonly storageKey = 'atelie-artes';
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
  tipos: Tipo[] = [];
  artes: Arte[] = [];

  private nextId = 1;

  ngOnInit(): void {
    this.loadArtes();
    this.tipos = [ { name: 'Pintura' }, { name: 'Escultura' }, { name: 'Fotografia' }, { name: 'Desenho' }, { name: 'Cerâmica' } ];
  }

  loadArtes() {
    const storedArtes = localStorage.getItem(this.storageKey);

    if (!storedArtes) {
      this.artes = [];
      this.nextId = 1;
      return;
    }

    try {
      this.artes = JSON.parse(storedArtes) as Arte[];
      this.nextId = this.artes.reduce((maxId, arte) => Math.max(maxId, arte.id ?? 0), 0) + 1;
    } catch {
      this.artes = [];
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

    if (arteToSave.id) {
      this.artes = this.artes.map((arte) =>
        arte.id === arteToSave.id ? { ...arteToSave } : arte
      );
    } else {
      this.artes = [...this.artes, { ...arteToSave, id: this.nextId }];
      this.nextId += 1;
    }

    this.persistArtes();
    this.resetForm();
  }

  edit(arte: Arte) {
    this.formModel.set({
      id: arte.id,
      name: arte.name,
      tipo: this.tipos.find((t) => t.name === arte.tipo) ?? null,
      description: arte.description,
      foto: arte.foto
    });
  }

  delete(id?: number) {
    if (!id) return;

    this.artes = this.artes.filter((arte) => arte.id !== id);
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
    localStorage.setItem(this.storageKey, JSON.stringify(this.artes));
  }
}
