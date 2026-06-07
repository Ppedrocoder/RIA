import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { input } from '@angular/core';
import { Arte } from '../app';
import { Router, RouterModule } from "@angular/router";


@Component({
  selector: 'app-list-actions',
  imports: [CommonModule, ButtonModule, RouterModule],
  template: `
    <div class="flex gap-4 mt-1">
        <div class="flex gap-6 justify-center w-full">
        <p-button label="Excluir" severity="secondary" [outlined]="true" class="w-full" styleClass="w-full" (click)="onDelete(a().id)" />
        <p-button label="Visualizar" severity="contrast" [outlined]="true" class="w-full" styleClass="w-full" (click)="onView(a().id)" />
        <p-button label="Editar" [outlined]="true" class="w-full" styleClass="w-full" (click)="onEdit(a())" />
        </div>
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
  router = inject(Router);

  onView(id?: number) {
    this.router.navigate(['', id]);
  }
}
