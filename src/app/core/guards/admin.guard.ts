// src/app/core/guards/admin.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser$;

  if (user && user()?.role === 'admin') {
    return true; // Accès admin autorisé
  } else {
    // Rediriger vers la page d'accueil
    router.navigate(['/todos']);
    return false; // Accès refusé
  }
};
