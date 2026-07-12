import { Component } from '@angular/core';
import { Arte } from '../app';
import { ArteService } from '../services/service';
import { TipoArteService } from '../services/tipo-arte-service';
import { AuthService } from '../auth/auth.service';
import { computed, inject, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { Form } from '../form/form';
import { List } from '../list/list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [DividerModule, Form, List],
  template: `
    <div class="relative w-full min-h-screen font-sans px-4 py-6">
      
      <div class="absolute top-4 right-4 z-10">
        <button 
          type="button" 
          (click)="Logout()" 
          class="inline-flex items-center gap-2 text-xs font-medium text-white rounded-lg px-3 py-1.5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
          <svg xmlns="http://w3.org" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sair
        </button>
      </div>

      <p-divider align="center" class="mb-4">
        <h2 class="text-4xl font-bold m-4 text-white">Ateliê Potiguar</h2>
      </p-divider>

      <div class="max-w-6xl mx-auto space-y-6">
        <app-form [tipos]="tipos()" [arteToEdit]="arteSelecionada()"></app-form>
        <app-list [artes]="artes()" (edit)="onEdit($event)" (delete)="onDelete($event)"></app-list>
      </div>

      <p-divider align="center" class="mt-8">
        <h2 class="text-2xl font-bold text-white m-4">Feito por: Pedro Ricardo</h2>
      </p-divider>
    </div>
  `,
  styleUrl: './home.css',
})
export class Home {
  protected readonly title = signal('atelie');
  arteService = inject(ArteService);
  tipoArteService = inject(TipoArteService);
  authService = inject(AuthService);
  router = inject(Router);
  arteSelecionada = signal<Arte | null>(null);
  artes = computed(() => this.arteService.getArtes());
  tipos = computed(() => this.tipoArteService.getTipos());

  ngOnInit(): void {
    this.arteService.loadArtes();
    this.tipoArteService.loadTipos();
  }

  onEdit(arte: Arte) {
    this.arteSelecionada.set({ ...arte });
  }

  onDelete(id: number) {
    this.arteService.delete(id);
  }

  Logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
