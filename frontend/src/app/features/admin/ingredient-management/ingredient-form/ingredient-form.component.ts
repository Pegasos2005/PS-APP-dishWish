import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IngredientService } from '../../../../core/services/ingredient.service';
import { Ingredient } from '../../../../core/interfaces/ingredient.interface';

@Component({
  selector: 'app-ingredient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.css']
})
export class IngredientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(IngredientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ingredientForm: FormGroup;
  isEditMode = false;
  currentId?: number;

  constructor() {
    this.ingredientForm = this.fb.group({
      name: ['', Validators.required],
      extraPrice: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.currentId = Number(id);
      this.loadIngredient(this.currentId);
    }
  }

  loadIngredient(id: number) {
    this.service.getIngredientById(id).subscribe((data: Ingredient) => {
      this.ingredientForm.patchValue(data);
    });
  }

  save() {
    if (this.ingredientForm.invalid) return;

    const ingredientData: Ingredient = this.ingredientForm.value;

    if (this.isEditMode) {
      this.service.updateIngredient(this.currentId!, ingredientData).subscribe(() => {
        this.router.navigate(['/admin/ingredient-management/ingredient-list']);
      });
    } else {
      this.service.createIngredient(ingredientData).subscribe(() => {
        this.router.navigate(['/admin/ingredient-management/ingredient-list']);
      });
    }
  }
}
