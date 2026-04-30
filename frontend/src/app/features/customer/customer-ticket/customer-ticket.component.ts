// src/app/features/customer/customer-ticket/customer-ticket.component.ts
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CustomerOrderService } from '../../../core/services/customer-order.service';

@Component({
  selector: 'app-customer-ticket',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-ticket.component.html',
  styleUrls: ['./customer-ticket.component.css']
})
export class CustomerTicketComponent implements OnInit {
  private router = inject(Router);
  public orderService = inject(CustomerOrderService); // <--- Público para el HTML

  isPaymentRequested = signal<boolean>(false);

  // Nuestro Signal ahora empieza vacío
  tableOrders = signal<any[]>([]);

  totalAmount = computed(() => {
    let total = 0;
    this.tableOrders().forEach(order => {
      order.items.forEach((item: any) => {
        total += (item.price * item.quantity);
      });
    });
    return total;
  });

  ngOnInit() {
    this.loadTicketData();
  }

  loadTicketData() {
    // AHORA LEEMOS LA MESA REAL DEL SERVICIO GLOBAL
    const currentTable = this.orderService.tableId();

    if (currentTable) {
      this.orderService.getTicketByTable(currentTable).subscribe({
        next: (backendOrders) => {
          const adaptedOrders = backendOrders.map((order, index) => {
            const dateObj = order.orderDate ? new Date(order.orderDate) : new Date();
            const timeString = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

            return {
              commandNumber: index + 1,
              time: timeString,
              items: order.items.map((item: any) => ({
                quantity: item.quantity,
                name: item.productName,
                price: item.productPrice
              }))
            };
          });

          this.tableOrders.set(adaptedOrders);
        },
        error: (err) => console.error("Error loading ticket:", err)
      });
    }
  }

  requestPayment(): void {
    this.isPaymentRequested.set(true);
  }

  cancelPayment(): void {
    this.isPaymentRequested.set(false);
  }
}
