import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { output } from '@angular/core';

@Component({
  selector: 'app-form-actions',
  imports: [CommonModule, ButtonModule],
template:`
  <div class="card flex justify-center m-4">
              <p-button [disabled]="formAtelie().invalid()" label="{{ formAtelie.id ? 'Atualizar' : 'Salvar' }}" (click)="onSave()" />
  </div>
          @if (formAtelie.id) {
            <div class="card flex justify-center m-4">
            <p-button [disabled]="formAtelie().invalid()" severity="secondary" label="Cancelar" (click)="onResetForm()" />
            </div>
          }
          
` ,
  styleUrl: './form-actions.css',
})
export class FormActions {
  @Input() formAtelie: any;
  save = output<void>();
  resetForm = output<void>();

  onSave() {
    this.save.emit();
  }

  onResetForm() {
    this.resetForm.emit();
  }
}
