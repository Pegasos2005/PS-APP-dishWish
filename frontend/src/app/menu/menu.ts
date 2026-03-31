import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para que funcionen cosas básicas
import { DATA_MENU } from './menu.mock';
import { ProductCard } from './product-card/product-card';        // Importar el json

@Component({
  selector: 'app-menu',
  imports: [ProductCard],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  /* Exporta el json para que lo use otro archivo (en este caso el menu.html)*/
  menuCategories = DATA_MENU;
}
