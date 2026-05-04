import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // <--- IMPORTANTE: Importar estos
import { Ingredient } from '../../../../core/interfaces/ingredient.interface';
import { IngredientService } from '../../../../core/services/ingredient.service';
import { IngredientSelectionService } from '../../../../core/services/ingredient-selection.service';

@Component({
  selector: 'app-ingredient-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ingredient-picker.component.html',
  styleUrls: ['./ingredient-picker.component.css']
})
export class IngredientPickerComponent implements OnInit {
  // Inyecciones
  private ingredientService = inject(IngredientService);
  private selectionService = inject(IngredientSelectionService);
  private location = inject(Location);
  private route = inject(ActivatedRoute); // <--- Inyectar
  private router = inject(Router);        // <--- Inyectar

  allIngredients = signal<Ingredient[]>([]);
  currentSelection = signal<Ingredient[]>([]);
  searchTerm = signal('');

  // Añadimos esta variable para guardar el ID
  productId: string | null = null;

  filteredIngredients = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.allIngredients().filter(ing => ing.name.toLowerCase().includes(term));
  });

  loadAllIngredients() {
    this.ingredientService.getIngredients().subscribe({
      next: (data) => this.allIngredients.set(data),
      error: (err) => console.error('Error:', err)
    });
  }

  isSelected(ingredient: Ingredient): boolean {
    return this.currentSelection().some(i => i.id === ingredient.id);
  }

  toggleIngredient(ingredient: Ingredient) {
    if (this.isSelected(ingredient)) {
      this.currentSelection.update(list => list.filter(i => i.id !== ingredient.id));
    } else {
      this.currentSelection.update(list => [...list, ingredient]);
    }
  }

  ngOnInit() {
    // Intentamos capturar el ID del snapshot actual o del padre (por si es ruta hija)
    this.productId = this.route.snapshot.paramMap.get('id') || 
                     this.route.parent?.snapshot.paramMap.get('id') || null;
    
    this.currentSelection.set(this.selectionService.getSelection());
    this.loadAllIngredients();
  }

  confirmSelection() {
    this.selectionService.setSelection(this.currentSelection());

    // Navegación explícita
    if (this.productId) {
      // Ajusta esta ruta a la que realmente usas para editar (ej: /admin/product-management/edit/...)
      this.router.navigate(['/admin/product-management/product-form', this.productId]);
    } else {
      // Si no hay ID, volvemos al formulario de creación normal
      this.router.navigate(['/admin/product-management/product-form']);
    }
  }
}
