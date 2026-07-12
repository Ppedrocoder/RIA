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
  selector: 'app-login',
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
          <h1 class="text-xl font-medium tracking-tight text-zinc-900">Acessar Conta</h1>
          <p class="text-xs text-zinc-500 mt-1 tracking-wide">Entre com seus dados de acesso.</p>
        </div>

        <div class="space-y-4">
          
            <div class="flex flex-col gap-1.5">
            <label for="username" class="text-xs font-medium text-zinc-600 tracking-wide">Usuário</label>
            <input
                id="username"
                type="text"
                pInputText
                class="w-full !bg-zinc-50 !border-zinc-200 focus:!border-zinc-950 !text-zinc-950 !text-sm !py-2.5 !px-3.5 !rounded-lg"
                [(ngModel)]="username"
                autocomplete="username"
            />
            </div>

            <div class="flex flex-col gap-1.5">
            <label for="password" class="text-xs font-medium text-zinc-600 tracking-wide">Senha</label>
            <p-password
                inputId="password"
                class="w-full"
                inputStyleClass="w-full !bg-zinc-50 !border-zinc-200 focus:!border-zinc-950 !text-zinc-950 !text-sm !py-2.5 !px-3.5 !rounded-lg"
                [(ngModel)]="password"
                [feedback]="false"
                [toggleMask]="true"
                autocomplete="current-password"
                (keydown.enter)="signin()"
            />
            </div>

          <div class="pt-2">
            <p-button
              label="Entrar"
              [loading]="loading()"
              [disabled]="!canSubmit()"
              (click)="signin()"
              styleClass="w-full !bg-zinc-950 !border-zinc-950 !text-white !text-sm !font-medium !py-2.5 !rounded-lg hover:!bg-zinc-900 focus:!shadow-none !cursor-pointer"
            />
          </div>

          @if (errorMsg()) {
            <p class="text-red-500 text-xs text-center mt-2 tracking-wide">{{ errorMsg() }}</p>
          }

          <div class="text-center pt-4 border-t border-zinc-100 mt-4">
            <button 
              type="button" 
              (click)="goToRegister()" 
              class="text-xs text-zinc-500 hover:text-zinc-950 font-medium tracking-wide underline underline-offset-4 transition-colors">
              Não tem uma conta? Cadastre-se
            </button>
          </div>

        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);

  username = signal<string>('');
  password = signal<string>('');
  loading = signal<boolean>(false);
  errorMsg = signal<string>('');

  canSubmit = computed(() => {
        return this.username().trim().length > 0 && 
            this.password().length >= 3
  });

  signin(): void {
    if (!this.canSubmit()) return;

    this.loading.set(true);
    this.errorMsg.set('');

    this.authService.login({ username: this.username(), password: this.password() }).subscribe({
      next: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Acesso autorizado.', life: 1500 });
        setTimeout(() => this.router.navigate(['']), 1000);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err?.status === 401 ? 'Credenciais inválidas.' : 'Erro de conexão com o servidor.');
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/cadastro']);
  }
}
