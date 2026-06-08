import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FieldTree } from '@angular/forms/signals';
import { Arte } from '../app';

@Component({
  selector: 'app-form-actions',
  imports: [CommonModule, ButtonModule],
template:`
  <div class="card flex justify-center m-4">
              <p-button [disabled]="formAtelie()().invalid()" label="{{ formAtelie()().value().id ? 'Atualizar' : 'Salvar' }}" (click)="onSave()" />
  </div>
          @if (formAtelie()().value().id) {
            <div class="card flex justify-center m-4">
            <p-button [disabled]="formAtelie()().invalid()" severity="secondary" label="Cancelar" (click)="onResetForm()" />
            </div>
          }
          
` ,
  styleUrl: './form-actions.css',
})
export class FormActions {
  formAtelie = input.required<FieldTree<Arte>>();
  save = output<void>();
  resetForm = output<void>();

  onSave() {
    this.save.emit();
  }

  onResetForm() {
    this.resetForm.emit();
  }
}
