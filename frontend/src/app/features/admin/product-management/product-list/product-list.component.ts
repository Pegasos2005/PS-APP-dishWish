import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products = signal<any[]>([
    { id: 1, name: 'Hamburguesa Clasica', price: 10.50 },
    { id: 2, name: 'Pizza Margarita', price: 9.00 }
  ]);

  addProduct() { console.log('Añadir nuevo'); }
  editProduct(p: any) { console.log('Editar:', p); }
  deleteProduct(p: any) { console.log('Borrar:', p); }
}
