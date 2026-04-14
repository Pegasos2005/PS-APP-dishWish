// src/app/features/customer/show-order/show-order.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CustomerOrderService } from '../../../core/services/customer-order.service';

@Component({
  selector: 'app-show-order',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './show-order.component.html',
  styleUrls: ['./show-order.component.css']
})
export class ShowOrderComponent {
  // Inyectamos el servicio del carrito y el enrutador
  public orderService = inject(CustomerOrderService);
  private router = inject(Router);

  // Por ahora, forzamos la mesa 1 (Más adelante lo cogeremos del inicio)
  public tableId = 1;

  increaseQuantity(product: any) {
    this.orderService.addProduct(product);
  }

  decreaseQuantity(product: any) {
    this.orderService.decreaseProduct(product);
  }

  // Transforma el carrito en una lista plana de IDs para Spring Boot
  private getProductIds(): number[] {
    const ids: number[] = [];
    this.orderService.order.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        ids.push(item.product.id);
      }
    });
    return ids;
  }

  sendOrder() {
    if (this.orderService.order.length === 0) {
      alert("Your cart is empty. Please add some products.");
      return;
    }

    // Estructura exacta que espera tu Backend (OrderRequestDTO)
    const orderPayload = {
      tableId: this.tableId,
      productIds: this.getProductIds()
    };

    console.log("Sending to kitchen:", orderPayload);

    // Llamada al servicio HTTP
    this.orderService.crearPedido(orderPayload).subscribe({
      next: () => {
        alert("Order sent to the kitchen successfully!");
        this.orderService.clear(); // Vaciamos el carrito tras el éxito

        // Navegamos a la vista del ticket para que vea cómo se cocina
        this.router.navigate(['/customer/customer-ticket']);
      },
      error: (err) => {
        console.error("Error sending order:", err);
        alert("Could not connect to the server. Please check your connection.");
      }
    });
  }
}
