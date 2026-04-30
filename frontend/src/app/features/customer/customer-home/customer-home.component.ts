// src/app/features/customer/customer-home/customer-home.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerOrderService } from '../../../core/services/customer-order.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.css']
})
export class CustomerHomeComponent {
  private router = inject(Router);
  public orderService = inject(CustomerOrderService);
  private authService = inject(AuthService);

  isExitModalOpen = signal<boolean>(false);
  authError = signal<boolean>(false);

  // Muestra el popup para salir
  requestExit(): void {
    this.isExitModalOpen.set(true);
  }

  cancelExit(): void {
    this.isExitModalOpen.set(false);
    this.authError.set(false);
  }

  confirmExit(username: string, pin: string): void {
    this.authService.login(username, pin).subscribe({
      next: (res) => {
        // Solo ADMIN o WAITER pueden desbloquear la mesa
        if (res.role === 'ADMIN' || res.role === 'WAITER') {
          this.orderService.setTableId(null); // Liberamos la mesa
          this.authService.logout(); // Cerramos la sesión del camarero/admin
          this.router.navigate(['/join-as']);
        } else {
          this.authError.set(true);
        }
      },
      error: () => this.authError.set(true)
    });
  }

  // Signal para el nombre del restaurante (fácilmente editable en el futuro)
  restaurantName = signal<string>('WishDish');

  startOrdering(): void {
    console.log('Navegando al catálogo de menú');
    this.router.navigate(['/customer/customer-menu']);
  }

  watchOrders(): void {
    console.log('Navegando a la vista del ticket');
    this.router.navigate(['/customer/customer-ticket']);
  }
}
