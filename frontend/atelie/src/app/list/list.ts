import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-list',
  imports: [CommonModule, CardModule, ButtonModule],
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
                    <div class="flex gap-4 mt-1">
                        <p-button label="Editar" [outlined]="true" class="w-full" styleClass="w-full" (click)="edit(a)" />
                        <p-button label="Excluir" severity="secondary" [outlined]="true" class="w-full" styleClass="w-full" (click)="delete(a.id)" />
                    </div>
                </ng-template>
            </p-card>
      </div>
      
    </li>
    }
    
  </ul>
  `,
  styleUrl: './list.css',
})
export class List {}
