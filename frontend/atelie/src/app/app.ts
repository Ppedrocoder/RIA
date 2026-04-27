import { Component, OnInit, signal } from '@angular/core';
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

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, InputTextModule, IftaLabelModule, ButtonModule, CardModule, SelectModule, DividerModule],
  template: ` 
  <p-divider align="center" class="mb-4">
    <h2 class="text-4xl font-bold m-4">Ateliê Potiguar</h2>
  </p-divider>
  <div class='justify-content-center text-center'>

  <div class="card flex justify-center m-4">
            <p-iftalabel>
                <input pInputText id="username" [(ngModel)]="arte.name" autocomplete="off" />
                <label for="username">Nome</label>
            </p-iftalabel>
  </div>
  <div class="card flex justify-center">
            <p-select [options]="tipos" [(ngModel)]="selectedTipo" [checkmark]="true" optionLabel="name" [showClear]="true" placeholder="Select a Tipo" class="w-full md:w-56" />
  </div>
  <div class="card flex justify-center m-4">
            <p-iftalabel>
                <input pInputText id="description" [(ngModel)]="arte.description" autocomplete="off" />
                <label for="description">Descrição</label>
            </p-iftalabel>
  </div>
  <div class="card flex justify-center m-4">
            <p-iftalabel>
                <input pInputText id="foto" [(ngModel)]="arte.foto" autocomplete="off" />
                <label for="foto">Foto</label>
            </p-iftalabel>
  </div>
  <div class="card flex justify-center m-4">
            <p-button label="{{ arte.id ? 'Atualizar' : 'Salvar' }}" (click)="save()" />
  </div>

  <div *ngIf="arte.id" class="card flex justify-center m-4">
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

  tipos: Tipo[] = [];
  selectedTipo: Tipo | undefined;
  artes: Arte[] = [];

  private nextId = 1;

  arte: Arte = {
    name: '',
    tipo: '',
    description: '',
    foto: ''
  };

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
    this.arte.tipo = this.selectedTipo?.name || '';

    if (this.arte.id) {
      this.artes = this.artes.map((arte) =>
        arte.id === this.arte.id ? { ...this.arte } : arte
      );
    } else {
      this.artes = [...this.artes, { ...this.arte, id: this.nextId }];
      this.nextId += 1;
    }

    this.persistArtes();
    this.resetForm();
  }

  edit(arte: Arte) {
    this.arte = { ...arte };
    this.selectedTipo = this.tipos.find((t) => t.name === arte.tipo);
  }

  delete(id?: number) {
    if (!id) return;

    this.artes = this.artes.filter((arte) => arte.id !== id);
    this.persistArtes();
  }

  resetForm() {
    this.arte = { name: '', tipo: '', description: '', foto: '' };
    this.selectedTipo = undefined;
  }

  private persistArtes() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.artes));
  }
}
