import { Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { FormField } from '@angular/forms/signals';
import { FormActions } from '../form-actions/form-actions';
import { Arte, TipoArte } from '../app';
import { form, required } from '@angular/forms/signals';
import { ArteService } from '../services/service';

@Component({
  selector: 'app-form',
  imports: [ CommonModule, FormsModule, InputTextModule, IftaLabelModule, ButtonModule, CardModule, SelectModule, DividerModule, FormField, FormActions],
  template: `
   <div class='justify-content-center text-center'>

  <div class="card flex justify-center m-4">
          <div class="grid grid-cols-1 md:grid-cols-1 gap-1">
            <p-iftalabel>
                <input pInputText id="username" [formField]="formAtelie.name" autocomplete="off" />
                <label for="username">Nome</label>
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
            <div class="grid grid-cols-1 md:grid-cols-1 gap-1">
              <p-select [options]="tipos()" [formField]="$any(formAtelie.tipoarte)" [checkmark]="true" optionLabel="name" [showClear]="true" placeholder="Selecione um Tipo" class="w-full md:w-56" />
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
          <div class="grid grid-cols-1 md:grid-cols-1 gap-1">
            <p-iftalabel >
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
        <div class="grid grid-cols-1 md:grid-cols-1 gap-1">
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
        </div>
  </div>
  <app-form-actions [formAtelie]="formAtelie" (save)="onSave()" (resetForm)="onResetForm()"></app-form-actions>

  `,
  styleUrl: './form.css',
})
export class Form {
  tipos = input<TipoArte[]>();
  arteToEdit = input<Arte | null>(null);

  private readonly arteService = inject(ArteService);
  private readonly formModel = signal<Arte>({
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
    effect(() => {
      const arte = this.arteToEdit();
      if (arte) {
        this.formModel.set({ ...arte });
      }
    });
  }

  onSave() {
    this.arteService.save(this.formModel(), () => this.resetForm());
  }

  onResetForm() {
    this.resetForm();
  }

  private resetForm() {
    this.formModel.set({
      id: undefined,
      name: '',
      tipoarte: null,
      description: '',
      foto: '',
    });
  }
}
