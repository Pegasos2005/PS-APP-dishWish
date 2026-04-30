// src/app/features/admin/passwd-admin.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-passwd-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './passwd-admin.component.html',
  styleUrls: ['./passwd-admin.component.css']
})
export class PasswdAdminComponent {
  private router = inject(Router);
  private authService = inject(AuthService); // <--- Inyectamos el servicio

  passwordError = signal<boolean>(false);

  verifyPassword(passwordInput: string): void {
    this.authService.login(null, passwordInput).subscribe({
      next: () => {
        this.passwordError.set(false);
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.passwordError.set(true);
        setTimeout(() => this.passwordError.set(false), 3000);
      }
    });
  }

  /**
   * Vuelve a la pantalla principal de "Join As"
   */
  goBack(): void {
    this.router.navigate(['/join-as']);
  }
}
