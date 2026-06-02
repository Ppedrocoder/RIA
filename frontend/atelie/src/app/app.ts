import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { List } from './list/list';
import { Form } from './form/form';
import { arteService } from './services/service';
import { form, required } from '@angular/forms/signals';
import { TipoArteService } from './services/tipo-arte-service';

export interface TipoArte {
  name: string;
}
export interface Arte{
  id?: number;
  name: string;
  tipoarte: TipoArte | null | string;
  description: string;
  foto: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, InputTextModule, IftaLabelModule, ButtonModule, CardModule, SelectModule, DividerModule, Form, List],
  template: ` 
  <p-divider align="center" class="mb-4">
    <h2 class="text-4xl font-bold m-4">Ateliê Potiguar</h2>
  </p-divider>
  <app-form [formAtelie]="formAtelie" [tipos]="tipos()" (save)="arteService.save(formModel)" (resetForm)="arteService.resetForm(formModel)"></app-form>
  <app-list [artes]="artes()" (edit)="arteService.edit($event, formModel, tipos())" (delete)="arteService.delete($event)"></app-list>
  <p-divider align="center" class="mt-4">
    <h2 class="text-2xl font-bold m-4">Feito por: Pedro Ricardo</h2>
  </p-divider>
  `,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('atelie');
  formModel = signal<Arte>({ 
      id: undefined,
      name: '', 
      tipoarte: null, 
      description: '',
      foto: '' 
    });
  
  formAtelie = form(this.formModel, (schemaPath) => {
    required(schemaPath.name, {message: 'O nome é obrigatório.'});
    required(schemaPath.tipoarte, {message: 'O tipo é obrigatório.'});
    required(schemaPath.description, {message: 'A descrição é obrigatória.'});
    required(schemaPath.foto, {message: 'A foto é obrigatória.'});
  });
  arteService = new arteService();
  tipoArteService = new TipoArteService();
  artes = computed(() => this.arteService.getArtes());
  tipos = computed(() => this.tipoArteService.getTipos());
  ngOnInit(): void {
    this.arteService.loadArtes();
    this.tipoArteService.setTipos([ { name: 'Pintura' }, { name: 'Escultura' }, { name: 'Fotografia' }, { name: 'Desenho' }, { name: 'Cerâmica' } ]);
  }
}
