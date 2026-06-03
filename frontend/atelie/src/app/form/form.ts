import { Component, input, output } from '@angular/core';
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
import { Input } from '@angular/core';
import { Arte, TipoArte } from '../app';

@Component({
  selector: 'app-form',
  imports: [ CommonModule, FormsModule, InputTextModule, IftaLabelModule, ButtonModule, CardModule, SelectModule, DividerModule, FormField, FormActions],
  template: `
   <div class='justify-content-center text-center'>

  <div class="card flex justify-center m-4">
          <div class="grid grid-cols-1 md:grid-cols-1 gap-1">
            <p-iftalabel>
                <input pInputText id="username" [formField]="formAtelie().name" autocomplete="off" />
                <label for="username">Nome</label>
            </p-iftalabel>
            @if (formAtelie().name().invalid()) {
              <ul>
                  @for (error of formAtelie().name().errors(); track error) {
                    <li class="text-red-500">{{ error.message }}</li>
                  }
              </ul>
            }
          </div>
  </div>
  <div class="card flex justify-center m-4">
            <div class="grid grid-cols-1 md:grid-cols-1 gap-1">
              <p-select [options]="tipos()" [formField]="$any(formAtelie().tipoarte)" [checkmark]="true" optionLabel="name" [showClear]="true" placeholder="Selecione um Tipo" class="w-full md:w-56" />
              @if (formAtelie().tipoarte().invalid()) {
                <ul>
                    @for (error of formAtelie().tipoarte().errors(); track error) {
                      <li class="text-red-500">{{ error.message }}</li>
                    }
                </ul>
              }
            </div>
  </div>
  <div class="card flex justify-center m-4">
          <div class="grid grid-cols-1 md:grid-cols-1 gap-1">
            <p-iftalabel >
                <input pInputText id="description" [formField]="formAtelie().description" autocomplete="off" />
                <label for="description">Descrição</label>
            </p-iftalabel>
            @if (formAtelie().description().invalid()) {
              <ul>
                  @for (error of formAtelie().description().errors(); track error) {
                    <li class="text-red-500">{{ error.message }}</li>
                  }
              </ul>
            }
          </div>
  </div>
  <div class="card flex justify-center m-4">
        <div class="grid grid-cols-1 md:grid-cols-1 gap-1">
            <p-iftalabel>
                <input pInputText id="foto" [formField]="formAtelie().foto" autocomplete="off" />
                <label for="foto">Foto</label>
            </p-iftalabel>
            @if (formAtelie().foto().invalid()) {
              <ul>
                  @for (error of formAtelie().foto().errors(); track error) {
                    <li class="text-red-500">{{ error.message }}</li>
                  }
              </ul>
            }
        </div>
  </div>
  <app-form-actions [formAtelie]="formAtelie()" (save)="onSave()" (resetForm)="onResetForm()"></app-form-actions>

  `,
  styleUrl: './form.css',
})
export class Form {
  formAtelie = input<any>();
  tipos = input<TipoArte[]>();
  save = output<void>();
  resetForm = output<void>();

  onSave() {
    this.save.emit();
  }

  onResetForm() {
    this.resetForm.emit();
  }
}
