import { Injectable, signal } from '@angular/core';
import { Arte } from '../app';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class ArteService {
  private apiUrl = 'http://localhost:3000/artes';
  constructor(private http: HttpClient){}
  artes = signal<Arte[]>([]);
  
  getArtes() {
    return this.http.get<Arte[]>(this.apiUrl).subscribe((data) => {
      this.artes.set(data);
    });
  }
  getArteById(id?: number) {
    if (!id) return null;
    return this.artes().find((arte) => arte.id === id) || null;
  }

  save(arteToSave: Arte) {
    this.http.post<Arte>(this.apiUrl, arteToSave).subscribe((savedArte) => {
      this.artes.update((artes) => [...artes, savedArte]);
    });
  }

  delete(id?: number) {
    if (!id) return;
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.artes.update((artes) => artes.filter((arte) => arte.id !== id));
    });
  }

  edit(arteToEdit: Arte) {
    if (!this.getArteById(arteToEdit.id)) return;
    this.http.patch<Arte>(`${this.apiUrl}/${arteToEdit.id}`, arteToEdit).subscribe((updatedArte) => {
      this.artes.update((artes) =>
        artes.map((arte) => (arte.id === updatedArte.id ? updatedArte : arte))
      );
    });
  }
}
