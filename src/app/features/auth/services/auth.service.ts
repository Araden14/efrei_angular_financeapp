import { Injectable, signal } from '@angular/core';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';
import { users } from '../../../data/users';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users = signal<User[]>(
    users.map(user => ({
      ...user,
      role: user.role as 'user' | 'admin',
      createdAt: new Date(user.createdAt)
    }))
  );

  private currentUser = signal<User | null>(null);

  // Simuler un délai réseau
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // POST - Connexion
  async login(
    credentials: LoginRequest,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    console.log('🔄 Service: Tentative de connexion...', credentials.email);
    await this.delay(500);

    const user = this.users().find(
      (u) => u.email === credentials.email && u.password === credentials.password,
    );

    if (user) {
      this.currentUser.set(user);
      console.log('✅ Service: Connexion réussie pour:', user.email);
      localStorage.setItem('token', user.token);
      return { success: true, user };
    } else {
      console.log('❌ Service: Échec de connexion pour:', credentials.email);
      return { success: false, error: 'Email ou mot de passe incorrect' };
    }
  }

  // POST - Inscription
  async register(
    userData: RegisterRequest,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    console.log("🔄 Service: Tentative d'inscription...", userData.email);
    await this.delay(600);

    // Vérifier si l'email existe déjà
    if (this.users().some((u) => u.email === userData.email)) {
      console.log('❌ Service: Email déjà utilisé:', userData.email);
      return { success: false, error: 'Cet email est déjà utilisé' };
    }

    // Vérifier que les mots de passe correspondent
    if (userData.password !== userData.confirmPassword) {
      console.log('❌ Service: Mots de passe différents');
      return { success: false, error: 'Les mots de passe ne correspondent pas' };
    }

    const newUser: User = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: 'user',
      createdAt: new Date(),
      token: this.generateToken(),
    };

    this.users.update((users) => [...users, newUser]);
    this.currentUser.set(newUser);
    localStorage.setItem('token', newUser.token);

    console.log('✅ Service: Inscription réussie pour:', newUser.email);
    return { success: true, user: newUser };
  }

  // POST - Déconnexion
  async logout(): Promise<void> {
    console.log('🔄 Service: Déconnexion...');
    await this.delay(200);
    this.currentUser.set(null);
    localStorage.removeItem('token');
    console.log('✅ Service: Déconnexion réussie');
  }

  // GET - Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  setCurrentUser(user: User): void {
    this.currentUser.set(user);
  }

  deleteUser(id: number): void {
    this.users.update((users) => users.filter((user) => user.id !== id));
  }

  // GET - Récupérer l'utilisateur actuel
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  // GET - Vérifier si l'utilisateur est admin
  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  getToken(): string {
    return this.currentUser()?.token ?? '';
  }
  findUserByToken(token: string): User | null {
    return this.users().find((user) => user.token === token) ?? null;
  }
  generateToken(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  readonly currentUser$ = this.currentUser.asReadonly();

  // GET - Récupérer tous les utilisateurs (admin seulement)
  async getAllUsers(): Promise<User[]> {
    console.log('🔄 Service: Récupération de tous les utilisateurs...');
    await this.delay(400);

    if (!this.isAdmin()) {
      throw new Error('Accès non autorisé');
    }

    console.log('✅ Service: Utilisateurs récupérés');
    return this.users().map((user) => ({
      ...user,
      password: '***', // Masquer les mots de passe
    }));
  }
}
