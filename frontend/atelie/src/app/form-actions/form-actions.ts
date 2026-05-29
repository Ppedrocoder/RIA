import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

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
  @Output() save = new EventEmitter<void>();
  @Output() resetForm = new EventEmitter<void>();

  onSave() {
    this.save.emit();
  }

  onResetForm() {
    this.resetForm.emit();
  }
}
