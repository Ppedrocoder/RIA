import { Component, computed, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { FormField } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { form, required } from '@angular/forms/signals';
import { ArteService } from '../services/service';
import { TipoArteService } from '../services/tipo-arte-service';
import { Arte } from '../app';

@Component({
  selector: 'app-edit',
  imports: [
    CommonModule, FormsModule, InputTextModule, IftaLabelModule,
    ButtonModule, CardModule, SelectModule, DividerModule,
    FormField, RouterModule
  ],
  template: `
    <p-divider align="center" class="mb-4">
      <h2 class="text-4xl font-bold m-4">Ateliê Potiguar</h2>
    </p-divider>

    <div class="ml-12 mt-4">
      <a routerLink="/" class="pi pi-arrow-left"></a>
    </div>

    <div class="mb-4 p-8 flex items-center justify-center flex-col">
      <h2 class="text-2xl font-bold mb-6">Editando: {{ formModel().name }}</h2>

      <div class="card flex justify-center m-4">
        <div class="grid grid-cols-1 gap-1">
          <p-iftalabel>
            <input pInputText id="name" [formField]="formAtelie.name" autocomplete="off" />
            <label for="name">Nome</label>
          </p-iftalabel>
          @if (formAtelie.name().invalid()) {
            <ul>
              @for (error of formAtelie.name().errors(); track error) {
                <li class="text-red-500">{{ error.message }}</li>
              }
            </ul>
          }
        </div>
      </div>

      <div class="card flex justify-center m-4">
        <div class="grid grid-cols-1 gap-1">
          <p-select
            [options]="tipos()"
            [formField]="$any(formAtelie.tipoarte)"
            [checkmark]="true"
            optionLabel="name"
            [showClear]="true"
            placeholder="Selecione um Tipo"
            class="w-full md:w-56"
          />
          @if (formAtelie.tipoarte().invalid()) {
            <ul>
              @for (error of formAtelie.tipoarte().errors(); track error) {
                <li class="text-red-500">{{ error.message }}</li>
              }
            </ul>
          }
        </div>
      </div>

      <div class="card flex justify-center m-4">
        <div class="grid grid-cols-1 gap-1">
          <p-iftalabel>
            <input pInputText id="description" [formField]="formAtelie.description" autocomplete="off" />
            <label for="description">Descrição</label>
          </p-iftalabel>
          @if (formAtelie.description().invalid()) {
            <ul>
              @for (error of formAtelie.description().errors(); track error) {
                <li class="text-red-500">{{ error.message }}</li>
              }
            </ul>
          }
        </div>
      </div>

      <div class="card flex justify-center m-4">
        <div class="grid grid-cols-1 gap-1">
          <p-iftalabel>
            <input pInputText id="foto" [formField]="formAtelie.foto" autocomplete="off" />
            <label for="foto">Foto (URL)</label>
          </p-iftalabel>
          @if (formAtelie.foto().invalid()) {
            <ul>
              @for (error of formAtelie.foto().errors(); track error) {
                <li class="text-red-500">{{ error.message }}</li>
              }
            </ul>
          }
          @if (formModel().foto) {
            <img [src]="formModel().foto" class="max-h-40 w-auto object-contain mt-2 rounded-lg" />
          }
        </div>
      </div>

      <div class="flex gap-4 mt-4">
        <p-button label="Cancelar" severity="secondary" routerLink="/" />
        <p-button label="Salvar" (click)="onSave()" />
      </div>
    </div>

    <p-divider align="center" class="mt-4">
      <h2 class="text-2xl font-bold m-4">Feito por: Pedro Ricardo</h2>
    </p-divider>
  `,
})
export class Edit {
  private arteService = inject(ArteService);
  private tipoArteService = inject(TipoArteService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  tipos = computed(() => this.tipoArteService.getTipos());

  formModel = signal<Arte>({
    id: undefined,
    name: '',
    tipoarte: null,
    description: '',
    foto: '',
  });

  formAtelie = form(this.formModel, (schemaPath) => {
    required(schemaPath.name, { message: 'O nome é obrigatório.' });
    required(schemaPath.tipoarte, { message: 'O tipo é obrigatório.' });
    required(schemaPath.description, { message: 'A descrição é obrigatória.' });
    required(schemaPath.foto, { message: 'A foto é obrigatória.' });
  });

  constructor() {
    this.arteService.loadArtes();
    this.tipoArteService.setTipos([
      { name: 'Pintura' }, { name: 'Escultura' },
      { name: 'Fotografia' }, { name: 'Desenho' }, { name: 'Cerâmica' }
    ]);

    const id = Number(this.route.snapshot.paramMap.get('id'));
    const arte = this.arteService.getArteById(id);
    if (arte) {
      this.formModel.set({ ...arte });
    }
  }

  onSave() {
    if (this.formAtelie().invalid()) return;
    this.arteService.save(this.formModel());
    this.router.navigate(['/']);
  }
}
