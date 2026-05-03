import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-crud-menu',
  standalone: true,
  templateUrl: './crud-menu.component.html',
  styleUrls: ['./crud-menu.component.css']
})
export class CrudMenuComponent {
  private router = inject(Router);
  private location = inject(Location);

  navigateTo(type: string) {
    if (type === 'products') {
      this.router.navigate(['/admin/product-management/product-list']);
    } else if (type === 'ingredients') {
      this.router.navigate(['/admin/ingredient-management/ingredient-list']);
    }
  }

  goBack() {
    this.location.back();
  }
}
