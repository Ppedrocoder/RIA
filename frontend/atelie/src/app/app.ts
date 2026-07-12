import { Component } from '@angular/core';
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
import { RouterModule } from "@angular/router";
import { ToastModule } from 'primeng/toast';

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
  imports: [CommonModule, FormsModule, InputTextModule, IftaLabelModule, ButtonModule, CardModule, SelectModule, DividerModule, RouterModule, ToastModule],
  template: ` 
  <p-toast position="top-right"></p-toast>
  <router-outlet></router-outlet>
  `,
  styleUrl: './app.css'
})
export class App {
}
