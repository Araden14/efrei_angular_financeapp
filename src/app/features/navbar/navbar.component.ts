import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { User } from '../auth/models/user.model';
import { CommonModule } from '@angular/common';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'navbar',
  imports: [CommonModule, Menubar],
  standalone: true,
  templateUrl: './navbar.component.html'
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  user = signal<User | null>(null);
  menuItems = signal<MenuItem[]>([]);

  ngOnInit(): void {
    this.user.set(this.authService.getCurrentUser() ?? null);
    this.updateMenuItems();
  }

  private updateMenuItems(): void {
    const items: MenuItem[] = [
      {
        label: 'Transactions',
        routerLink: '/'
      },
      {
        label: 'Analytics',
        routerLink: '/analytics'
      }

    ];

    if (this.user()?.role === 'admin') {
      items.push({
        label: 'Reports',
        routerLink: '/admin'
      });
    }

    items.push({
        label: 'Logout',
        icon: 'pi pi-sign-out',
        styleClass: 'p-button-danger', // Applies danger styling to the menu item
        command: () => {
          this.logout(); // Calls your existing logout() method
      }
    })

    this.menuItems.set(items);
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
