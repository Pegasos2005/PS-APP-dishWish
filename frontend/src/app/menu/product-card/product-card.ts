import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from './product.interface';
import { OrderService } from '../../services/order';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})

export class ProductCard {
  @Input() product!: Product;

  // nota: si se le pone private/public ya hace la asignacion automaticamente: this.orderService = orderService
  constructor(private orderService: OrderService) {}

  onAddClick(){
    this.orderService.addProduct(this.product)
  }
}
