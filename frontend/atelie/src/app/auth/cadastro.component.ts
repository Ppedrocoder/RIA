import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <p-toast />

    <div class="min-h-screen flex items-center justify-center bg-zinc-50 font-sans px-4">
      <div class="w-full max-w-sm bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
        
        <div class="mb-8 text-left">
          <h1 class="text-xl font-medium tracking-tight text-zinc-900">Criar Nova Conta</h1>
          <p class="text-xs text-zinc-500 mt-1 tracking-wide">Preencha os campos para se registrar.</p>
        </div>

        <div class="space-y-4 text-black">
          
            <div class="flex flex-col gap-1.5">
                <label for="username" class="text-xs font-medium text-zinc-600 tracking-wide">Usuário</label>
                <input
                id="username"
                type="text"
                pInputText
                class="w-full !bg-zinc-50 !border-zinc-200 focus:!border-zinc-950 !text-zinc-950 !text-sm !py-2.5 !px-3.5 !rounded-lg"
                [(ngModel)]="username"
                name="username"
                autocomplete="username"
                />
            </div>

            <div class="flex flex-col gap-1.5">
                <label for="email" class="text-xs font-medium text-zinc-600 tracking-wide">E-mail</label>
                <input
                id="email"
                type="email"
                pInputText
                class="w-full !bg-zinc-50 !border-zinc-200 focus:!border-zinc-950 !text-zinc-950 !text-sm !py-2.5 !px-3.5 !rounded-lg"
                [(ngModel)]="email"
                name="email"
                autocomplete="email"
                />
            </div>

            <div class="flex flex-col gap-1.5">
                <label for="password" class="text-xs font-medium text-zinc-600 tracking-wide">Senha (mínimo 3 caracteres)</label>
                <p-password
                inputId="password"
                class="w-full"
                styleClass="w-full"
                inputStyleClass="w-full !bg-zinc-50 !border-zinc-200 focus:!border-zinc-950 !text-zinc-950 !text-sm !py-2.5 !px-3.5 !rounded-lg"
                [(ngModel)]="password"
                name="password"
                [feedback]="false"
                [toggleMask]="true"
                autocomplete="new-password"
                />
            </div>

          <div class="pt-2">
            <p-button
              label="Registrar"
              [loading]="loading()"
              [disabled]="!canSubmit()"
              (click)="register()"
              styleClass="w-full !bg-zinc-950 !border-zinc-950 !text-white !text-sm !font-medium !py-2.5 !rounded-lg hover:!bg-zinc-900 focus:!shadow-none !cursor-pointer"
            />
          </div>

          @if (errorMsg()) {
            <p class="text-red-500 text-xs text-center mt-2 tracking-wide">{{ errorMsg() }}</p>
          }

          <div class="text-center pt-4 border-t border-zinc-100 mt-4">
            <button 
              type="button" 
              (click)="goToLogin()" 
              class="text-xs text-zinc-500 hover:text-zinc-950 font-medium tracking-wide underline underline-offset-4 transition-colors">
              Já possui uma conta? Entre
            </button>
          </div>

        </div>
      </div>
    </div>
  `,
})
export class CadastroComponent {
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);
    private readonly messageService = inject(MessageService);

    username = signal('');
    email = signal('');
    telefone = signal('');
    password = signal('');

    loading = signal<boolean>(false);
    errorMsg = signal<string>('');

    canSubmit = computed(() => {
        return this.username().trim().length > 0 && 
            this.password().length >= 3 && 
            this.email().trim().includes('@');
    });
    register(): void {
        console.log('Botão registrar clicado!');
        console.log('Dados atuais reais:', { 
            username: this.username(), 
            email: this.email(), 
            password: this.password() 
        });

        if (!this.canSubmit()) {
            return;
        }

        this.loading.set(true);
        this.errorMsg.set('');

        const payload = {
            username: this.username(), 
            email: this.email(),       
            password: this.password(), 
            telefone: this.telefone()  
        };

        this.authService.registrar(payload).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta criada! Efetuando login...', life: 1500 });
                
                this.authService.login({ username: this.username(), password: this.password() }).subscribe({
                    next: () => {
                        this.loading.set(false);
                        setTimeout(() => this.router.navigate(['']), 1000);
                    },
                    error: () => {
                        this.loading.set(false);
                        this.router.navigate(['/login']);
                    }
                });
            },
            error: (err) => {
                this.loading.set(false);
                this.errorMsg.set(err?.error?.detail || 'Erro ao efetuar o cadastro.');
            }
        });
    }

    goToLogin(): void {
        this.router.navigate(['/login']);
    }
}
