import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-list-actions',
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="flex gap-4 mt-1">
        <p-button label="Editar" [outlined]="true" class="w-full" styleClass="w-full" (click)="onEdit(a)" />
        <p-button label="Excluir" severity="secondary" [outlined]="true" class="w-full" styleClass="w-full" (click)="onDelete(a.id)" />
    </div> 
  ` ,
  styleUrl: './list-actions.css',
})
export class ListActions {
  @Input() a: any;
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();

  onEdit(art: any) {
    this.edit.emit(art);
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }
}
