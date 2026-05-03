import { Component, OnInit, inject, signal, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ingredient } from '../../../../core/interfaces/ingredient.interface';
import { IngredientService } from '../../../../core/services/ingredient.service';

@Component({
  selector: 'app-ingredient-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ingredient-picker.component.html',
  styleUrls: ['./ingredient-picker.component.css']
})
export class IngredientPickerComponent implements OnInit {
  private ingredientService = inject(IngredientService);

  // Lista total de ingredientes disponibles
  allIngredients = signal<Ingredient[]>([]);

  // Lista de ingredientes actualmente seleccionados (vendría de un Input)
  @Input() selectedIngredients: Ingredient[] = [];

  searchTerm = signal('');

  // Filtramos la lista total
  filteredIngredients = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.allIngredients().filter(ingredient =>
      ingredient.name.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.loadAllIngredients();
  }

  loadAllIngredients() {
    this.ingredientService.getIngredients().subscribe({
      next: (data) => this.allIngredients.set(data),
      error: (err) => console.error('Error:', err)
    });
  }

  // Comprueba si está en preferencias
  isSelected(ingredient: Ingredient): boolean {
    return this.selectedIngredients.some(i => i.id === ingredient.id);
  }

  // Alterna selección
  toggleIngredient(ingredient: Ingredient) {
    if (this.isSelected(ingredient)) {
      this.selectedIngredients = this.selectedIngredients.filter(i => i.id !== ingredient.id);
    } else {
      this.selectedIngredients = [...this.selectedIngredients, ingredient];
    }
  }
}
