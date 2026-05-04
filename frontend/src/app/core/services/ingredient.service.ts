import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Asegúrate de que esta interfaz exista en tu carpeta de interfaces
import { Ingredient } from '../interfaces/ingredient.interface';

@Injectable({ providedIn: 'root' })
export class IngredientService {
  private http = inject(HttpClient);

  // URL base para ingredientes (asumiendo que en tu environment.apiUrl tienes el prefijo /api/)
  private readonly API_URL = environment.apiUrl + 'ingredients';

  getIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.API_URL);
  }

  getIngredientById(id: number): Observable<Ingredient> {
    return this.http.get<Ingredient>(`${this.API_URL}/${id}`);
  }

  createIngredient(data: Ingredient): Observable<Ingredient> {
    return this.http.post<Ingredient>(this.API_URL, data);
  }

  updateIngredient(id: number, data: Ingredient): Observable<Ingredient> {
    return this.http.put<Ingredient>(`${this.API_URL}/${id}`, data);
  }

  deleteIngredient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
