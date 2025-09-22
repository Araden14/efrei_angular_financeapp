import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { EuroNoteComponent } from '../euro-note/euro-note';
import { User } from '../auth/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'navbar',
  imports: [EuroNoteComponent, CommonModule, RouterLink],
  standalone: true,
  templateUrl: './navbar.component.html'
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  user = signal<User | null>(null);

  ngOnInit(): void {
     this.user.set(this.authService.getCurrentUser() ?? null);
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
