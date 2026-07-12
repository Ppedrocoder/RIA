import { Injectable, signal } from '@angular/core';
import { Arte } from '../app';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class ArteService {
  private apiUrl = 'http://localhost:8000/api/logica/artes';
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
  ){}
  artes = signal<Arte[]>([]);
  
  getArtes() {
    return this.artes();
  }

  loadArtes() {
    return this.http.get<Arte[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.artes.set(data);
      },
      error: (error: HttpErrorResponse) => {
        this.showError('Nao foi possivel carregar as artes.', error);
      },
    });
  }

  getArteById(id?: number) {
    if (!id) return null;
    return this.artes().find((arte) => arte.id === id) || null;
  }

  loadArteById(id: number) {
    return this.http.get<Arte>(`${this.apiUrl}/${id}`).subscribe({
      next: (arte) => {
        const exists = this.getArteById(id);
        if (exists) {
          this.artes.update((artes) =>
            artes.map((item) => (item.id === arte.id ? arte : item))
          );
          return;
        }
        this.artes.update((artes) => [...artes, arte]);
      },
      error: (error: HttpErrorResponse) => {
        this.showError('Nao foi possivel carregar a arte.', error);
      },
    });
  }

  save(arteToSave: Arte, onSuccess?: () => void) {
    this.http.post<Arte>(this.apiUrl, arteToSave).subscribe({
      next: (savedArte) => {
        this.artes.update((artes) => [...artes, savedArte]);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Arte criada com sucesso.',
        });
        onSuccess?.();
      },
      error: (error: HttpErrorResponse) => {
        this.showError('Nao foi possivel criar a arte.', error);
      },
    });
  }

  delete(id?: number, onSuccess?: () => void) {
    if (!id) return;
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.artes.update((artes) => artes.filter((arte) => arte.id !== id));
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Arte excluida com sucesso.',
        });
        onSuccess?.();
      },
      error: (error: HttpErrorResponse) => {
        this.showError('Nao foi possivel excluir a arte.', error);
      },
    });
  }

  edit(arteToEdit: Arte, onSuccess?: () => void) {
    if (!arteToEdit.id) return;
    this.http.patch<Arte>(`${this.apiUrl}/${arteToEdit.id}`, arteToEdit).subscribe({
      next: (updatedArte) => {
        const exists = this.getArteById(updatedArte.id);
        if (exists) {
          this.artes.update((artes) =>
            artes.map((arte) => (arte.id === updatedArte.id ? updatedArte : arte))
          );
        } else {
          this.artes.update((artes) => [...artes, updatedArte]);
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Arte atualizada com sucesso.',
        });
        onSuccess?.();
      },
      error: (error: HttpErrorResponse) => {
        this.showError('Nao foi possivel atualizar a arte.', error);
      },
    });
  }

  private showError(detail: string, error: HttpErrorResponse) {
    const apiMessage =
      typeof error.error === 'object' && error.error && 'error' in error.error
        ? String(error.error.error)
        : '';

    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: apiMessage ? `${detail} ${apiMessage}` : detail,
    });
  }
}
