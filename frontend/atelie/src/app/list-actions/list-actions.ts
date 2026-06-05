import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { input } from '@angular/core';
import { Arte } from '../app';

@Component({
  selector: 'app-list-actions',
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="flex gap-4 mt-1">
        <p-button label="Editar" [outlined]="true" class="w-full" styleClass="w-full" (click)="onEdit(a())" />
        <p-button label="Excluir" severity="secondary" [outlined]="true" class="w-full" styleClass="w-full" (click)="onDelete(a().id)" />
    </div> 
  ` ,
  styleUrl: './list-actions.css',
})
export class ListActions {
  a = input.required<Arte>();
  edit = output<Arte>();
  delete = output<number>();

  onEdit(art: Arte) {
    this.edit.emit(art);
  }

  onDelete(id?: number) {
    if (!id) return;

    this.delete.emit(id);
  }
}
