import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('token');
  let user = null;
  if (token) {
    user = authService.findUserByToken(token);
    if (user) {
      authService.setCurrentUser(user);
    }
  }
  if (user) {
    return true; // Utilisateur connecté
  } else {
    console.log('access denied');
    // Rediriger vers la page de connexion
    router.navigate(['/login']);
    return false; // Accès refusé
  }
};
