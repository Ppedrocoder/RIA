import { Component, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ListActions } from '../list-actions/list-actions';
import { Input, Output } from '@angular/core';

@Component({
  selector: 'app-list',
  imports: [CommonModule, CardModule, ButtonModule, ListActions],
  template: `
     <ul>
    @for (a of artes; track a.id) {
      <li>
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
                    <app-list-actions [a]="a" (edit)="onEdit($event)" (delete)="onDelete($event)"></app-list-actions>
                </ng-template>
            </p-card>
      </div>
      
    </li>
    }
    
  </ul>
  `,
  styleUrl: './list.css',
})
export class List {
  @Input() artes: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();

  onEdit(art: any) {
    this.edit.emit(art);
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }
}
