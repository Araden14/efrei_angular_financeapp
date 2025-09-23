// Service utilisé pour ajouter / supprimer des utilisateurs 
import { Injectable, signal } from '@angular/core';
import { users } from '../../data/users';
import { User } from '../../features/auth/models/user.model';

@Injectable({
  providedIn: 'root' })
export class UserService {
categories = signal<User[]>(users.map(user => ({
  ...user,
  role: user.role as 'admin' | 'user',
  createdAt: new Date(user.createdAt)
})));


  getUsers() {
    return this.categories;
  }

  addUser(user: User) {
    this.categories.update(categories => [...categories, user]);
  }

  updateUser(originalUser: User, updatedUser: User) {
    this.categories.update(categories => categories.map(c => c.name === originalUser.name ? updatedUser : c));
  }

  deleteUser(user: User) {
    this.categories.update(categories => categories.filter(c => c.name !== user.name));
  }
}
