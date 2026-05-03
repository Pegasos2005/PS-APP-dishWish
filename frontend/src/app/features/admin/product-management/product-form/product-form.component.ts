import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private productService = inject(ProductService);

  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  currentProduct: any = null; // Para guardar el producto y mostrar su imagen

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      picture: [''],
      productIngredients: this.fb.array([]) // Array para ingredientes
    });
  }

  get ingredientsArray(): FormArray {
    return this.productForm.get('productIngredients') as FormArray;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = Number(id);
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        // 1. Relleno básico
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          picture: product.picture
        });

        // 2. Relleno de ingredientes
        const ingredientsArray = this.ingredientsArray;
        ingredientsArray.clear();

        // OJO: Usamos 'product.ingredients' (como se llama en tu DTO de Java)
        if (product.ingredients && Array.isArray(product.ingredients)) {
          product.ingredients.forEach((ing: any) => {
            ingredientsArray.push(this.fb.group({
              // Mapeamos los campos que definiste en IngredientDTO
              id: [ing.id],
              name: [ing.name],
              extraPrice: [ing.extraPrice],
              isDefault: [ing.isDefault]
            }));
          });
        }
      },
      error: (err) => console.error('Error cargando producto:', err)
    });
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    // Si estamos en modo edición (que lo sabemos porque productId no es null)
    if (this.isEditMode && this.productId) {

      // MODO EDICIÓN
      this.productService.updateProduct(this.productId, this.productForm.value)
        .subscribe({
          next: () => this.router.navigate(['/admin/products']),
          error: (err) => console.error("Error al actualizar", err)
      });
    } else {
          // MODO CREACIÓN (Añadir)
          this.productService.createProduct(this.productForm.value)
            .subscribe({
              next: () => {
                console.log("Producto creado con éxito");
                this.router.navigate(['/admin/product-management/product-list']);
              },
              error: (err) => console.error("Error al crear", err)
            });
    }
  }

  openIngredientPicker() {
    // Si estamos editando, pasamos el ID, si no, navegamos sin ID
    if (this.isEditMode && this.productId) {
      this.router.navigate(['/admin/product-management/ingredient-picker', this.productId]);
    } else {
      // Nota: Si es nuevo producto, aquí podrías guardar el estado
      // en un servicio temporal si quieres volver con los datos escritos.
      this.router.navigate(['/admin/product-management/ingredient-picker']);
    }
  }

  goBack() { this.location.back(); }
}
