import { Component } from '@angular/core';
import { Arte } from '../app';
import { ArteService } from '../services/service';
import { TipoArteService } from '../services/tipo-arte-service';
import { computed, inject, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { Form } from '../form/form';
import { List } from '../list/list';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [DividerModule, Form, List, RouterModule],
  template: `
    <p-divider align="center" class="mb-4">
    <h2 class="text-4xl font-bold m-4">Ateliê Potiguar</h2>
  </p-divider>
  <app-form [tipos]="tipos()" [arteToEdit]="arteSelecionada()"></app-form>
  <app-list [artes]="artes()" (edit)="onEdit($event)" (delete)="onDelete($event)"></app-list>
  <p-divider align="center" class="mt-4">
    <h2 class="text-2xl font-bold m-4">Feito por: Pedro Ricardo</h2>
  </p-divider>
  <router-outlet></router-outlet>
  `,
  styleUrl: './home.css',
})
export class Home {
  protected readonly title = signal('atelie');
  arteService = inject(ArteService);
  tipoArteService = inject(TipoArteService);
  arteSelecionada = signal<Arte | null>(null);
  artes = computed(() => this.arteService.getArtes());
  tipos = computed(() => this.tipoArteService.getTipos());
  ngOnInit(): void {
    this.arteService.loadArtes();
    this.tipoArteService.setTipos([ { name: 'Pintura' }, { name: 'Escultura' }, { name: 'Fotografia' }, { name: 'Desenho' }, { name: 'Cerâmica' } ]);
  }

  onEdit(arte: Arte) {
    this.arteSelecionada.set({ ...arte });
  }

  onDelete(id: number) {
    this.arteService.delete(id);
  }
}
