// src/app/features/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'passwd-admin', pathMatch: 'full' },
  {
    path: 'passwd-admin',
    loadComponent: () => import('./passwd-admin/passwd-admin.component').then(c => c.PasswdAdminComponent)
  },
  {
    path: '',
    canActivate: [adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      // Nueva ruta para gestionar productos
      {
        path: 'products',
        loadComponent: () => import('./product-management/product-list/product-list.component').then(c => c.ProductListComponent)
      }
    ]
  }
];
