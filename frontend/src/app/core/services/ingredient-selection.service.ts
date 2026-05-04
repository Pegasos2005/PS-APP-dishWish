import { Injectable } from '@angular/core';
import { Ingredient } from '../interfaces/ingredient.interface';

@Injectable({ providedIn: 'root' })
export class IngredientSelectionService {
  private selected: Ingredient[] = [];

  setSelection(ingredients: Ingredient[]) {
    this.selected = ingredients;
  }

  getSelection(): Ingredient[] {
    return this.selected;
  }

  hasPendingChanges(): boolean {
    return this.selected.length > 0;
  }

  clear() {
    this.selected = [];
  }
}
