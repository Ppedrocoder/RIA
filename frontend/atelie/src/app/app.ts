import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';


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
  imports: [CommonModule, FormsModule, InputTextModule, IftaLabelModule, ButtonModule, CardModule, SelectModule, DividerModule],
  template: ` 
  <p-divider align="center" class="mb-4">
    <h2 class="text-4xl font-bold m-4">Ateliê Potiguar</h2>
  </p-divider>
  <div class='justify-content-center text-center'>

  <div class="card flex justify-center m-4">
          <div class="grid grid-cols-1 md:grid-cols-1 gap-1">
            <p-iftalabel [class.p-invalid]="nameError()">
                <input pInputText id="username" [ngModel]="FormModel().name" (ngModelChange)="updateForm('name', $event)" autocomplete="off" />
                <label for="username">Nome</label>
            </p-iftalabel>
            @if (nameError()) {
              <span class="text-red-500 text-sm">{{ nameError() }}</span>
            }
          </div>
  </div>
  <div class="card flex justify-center m-4">
            <div class="grid grid-cols-1 md:grid-cols-1 gap-1">
              <p-select [options]="tipos" [ngModel]="FormModel().tipo" (ngModelChange)="updateForm('tipo', $event)" [checkmark]="true" optionLabel="name" [showClear]="true" placeholder="Select a Tipo" class="w-full md:w-56" [class.p-invalid]="tipoError()" />
              @if (tipoError()) {
                <span class="text-red-500 text-sm">{{ tipoError() }}</span>
              }
            </div>
  </div>
  <div class="card flex justify-center m-4">
          <div class="grid grid-cols-1 md:grid-cols-1 gap-1">
            <p-iftalabel [class.p-invalid]="descriptionError()">
                <input pInputText id="description" [ngModel]="FormModel().description" (ngModelChange)="updateForm('description', $event)" autocomplete="off" />
                <label for="description">Descrição</label>
            </p-iftalabel>
            @if (descriptionError()) {
              <span class="text-red-500 text-sm">{{ descriptionError() }}</span>
            }
          </div>
  </div>
  <div class="card flex justify-center m-4">
        <div class="grid grid-cols-1 md:grid-cols-1 gap-1">
            <p-iftalabel [class.p-invalid]="fotoError()">
                <input pInputText id="foto" [ngModel]="FormModel().foto" (ngModelChange)="updateForm('foto', $event)" autocomplete="off" />
                <label for="foto">Foto</label>
            </p-iftalabel>
            @if (fotoError()) {
              <span class="text-red-500 text-sm">{{ fotoError() }}</span>
            }
        </div>
  </div>
  <div class="card flex justify-center m-4">
              <p-button label="{{ FormModel().id ? 'Atualizar' : 'Salvar' }}" (click)="save()" />
  </div>

          <div *ngIf="FormModel().id" class="card flex justify-center m-4">
            <p-button severity="secondary" label="Cancelar" (click)="resetForm()" />
  </div>
  <ul>
    <li *ngFor="let a of artes">
      <div class="mb-4 p-8 flex items-center justify-center">
            <p-card [style]="{ width: '25rem', overflow: 'hidden' }">
                <ng-template #header>
                    <img alt="Card" class="w-full" [src]="a.foto" [alt]="a.name" />
                </ng-template>
                <ng-template #title> {{ a.name }} </ng-template>
                <ng-template #subtitle> {{ a.tipo }} </ng-template>
                <p>
                    {{ a.description }}
                </p>
                <ng-template #footer>
                    <div class="flex gap-4 mt-1">
                        <p-button label="Editar" [outlined]="true" class="w-full" styleClass="w-full" (click)="edit(a)" />
                        <p-button label="Excluir" severity="secondary" [outlined]="true" class="w-full" styleClass="w-full" (click)="delete(a.id)" />
                    </div>
                </ng-template>
            </p-card>
      </div>
      
    </li>
  </ul>
  <p-divider align="center" class="mt-4">
    <h2 class="text-2xl font-bold m-4">Feito por: Pedro Ricardo</h2>
  </p-divider>
  `,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('atelie');
  private readonly storageKey = 'atelie-artes';

  FormModel = signal<Forms>({ 
    id: undefined,
    name: '', 
    tipo: null, 
    description: '',
    foto: '' 
  });

  tipos: Tipo[] = [];
  artes: Arte[] = [];

  private nextId = 1;

  nameError = computed(() => {
    if (!this.FormModel().name.trim()) {
      return 'O nome é obrigatório.';
    }
    return ''
  });

  tipoError = computed(() => {
    if (!this.FormModel().tipo) {
      return 'O tipo é obrigatório.';
    }
    return ''
  });

  descriptionError = computed(() => {
    if (!this.FormModel().description.trim()) {
      return 'A descrição é obrigatória.';
    }
    return ''
  });

  fotoError = computed(() => {
    if (!this.FormModel().foto.trim()) {
      return 'A foto é obrigatória.';
    }
    return ''
  });

  ngOnInit(): void {
    this.loadArtes();
    this.tipos = [ { name: 'Pintura' }, { name: 'Escultura' }, { name: 'Fotografia' }, { name: 'Desenho' }, { name: 'Cerâmica' } ];
  }

  updateForm<K extends keyof Forms>(field: K, value: Forms[K]) {
    this.FormModel.update((form) => ({
      ...form,
      [field]: value
    }));
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
    const form = this.FormModel();
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
    this.FormModel.set({
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
    this.FormModel.set({
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
