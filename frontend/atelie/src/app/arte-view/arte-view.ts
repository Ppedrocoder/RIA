import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ArteService } from '../services/service';
import { inject } from '@angular/core';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-arte-view',
  imports: [CommonModule, DividerModule, RouterModule],
  template: `
  <p-divider align="center" class="mb-4">
    <h2 class="text-4xl font-bold m-4">Ateliê Potiguar</h2>
  </p-divider>
  <div class="ml-12 mt-4">
    <a routerLink="/" class="pi pi-arrow-left"></a>
  </div>
  <div class="mb-4 p-8 flex items-center justify-center flex-col">
    <h1 class="justify-content">Arte: {{ arte()?.name }}</h1>
    <img [src]="arte()?.foto" alt="{{ arte()?.name }}" class="w-full h-auto mb-4" />
    <p class="mb-4">{{ arte()?.description }}</p>
    <p class="mb-4">Tipo de Arte: {{ tipoArteNome }}</p>
  </div>
  <p-divider align="center" class="mt-4">
    <h2 class="text-2xl font-bold m-4">Feito por: Pedro Ricardo</h2>
  </p-divider>
  ` ,
  styleUrl: './arte-view.css',
})
export class ArteView {
  arteService = inject(ArteService);
  artes = this.arteService.getArtes();
  id = input<number>();
  arte = computed(() => {
    const id = Number(this.id());
    return this.arteService.getArteById(id);
  });
  constructor() {
    this.arteService.loadArtes();
  }
  get tipoArteNome(): string {
    const tipo = this.arte()?.tipoarte;
    if (!tipo) return '';
    return typeof tipo === 'string' ? tipo : tipo.name;
  }
}
