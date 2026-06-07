import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ArteService } from '../services/service';
import { inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from "@angular/router";
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'app-arte-view',
  imports: [CommonModule, DividerModule, RouterModule, FieldsetModule],
  template: `
  <p-divider align="center" class="mb-4">
    <h2 class="text-4xl font-bold m-4">Ateliê Potiguar</h2>
  </p-divider>
  <div class="ml-12 mt-4">
    <a routerLink="/" class="pi pi-arrow-left"></a>
  </div>
  <div class="mb-4 p-8 flex items-center justify-center flex-col">
    <h1 class="text-3xl font-bold mb-4">{{ arte()?.name }}</h1>
    <img [src]="arte()?.foto" alt="{{ arte()?.name }}" class="max-h-96 w-auto object-contain mb-4" />
    <div class="card mb-4">
            <p-fieldset legend="Descrição">
                <p class="m-0">
                    {{ arte()?.description }}
                </p>
            </p-fieldset>
    </div>
    <div class="card mb-4">
            <p-fieldset legend="Tipo de Arte">
                <p class="m-0">
                    {{ tipoArteNome }}
                </p>
            </p-fieldset>
    </div>
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
  private route = inject(ActivatedRoute);
  id: string | null = this.route.snapshot.paramMap.get('id');
  arte = computed(() => {
    const id = Number(this.id);
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
