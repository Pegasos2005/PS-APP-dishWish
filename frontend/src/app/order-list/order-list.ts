import { Component } from '@angular/core';
import { OrderService } from '../services/order';
import { Producto } from '../models/producto.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-list',
  imports: [RouterLink],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css',
})
export class OrderList {
  constructor(public orderService: OrderService) {}

  increment(product: Producto) {
    this.orderService.addProduct(product);
  }

  decrement(product: Producto) {
    this.orderService.decreaseProduct(product);
  }
}
