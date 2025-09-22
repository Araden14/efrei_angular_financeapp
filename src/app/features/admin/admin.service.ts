import { Injectable, signal } from '@angular/core';
import { users } from '../../data/users';
import { categories, Category } from '../../data/categories';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private _users = signal([...users]);
  private _categories = signal([...categories]);

  // Users
  get users() {
    return this._users.asReadonly();
  }

  removeUser(userId: number): void {
    this._users.update(users => users.filter(user => user.id !== userId));
  }

  // Categories
  get categories() {
    return this._categories.asReadonly();
  }

  addCategory(category: Category): void {
    this._categories.update(categories => [...categories, category]);
  }

  updateCategory(index: number, category: Category): void {
    this._categories.update(categories => {
      const updated = [...categories];
      updated[index] = category;
      return updated;
    });
  }

  removeCategory(index: number): void {
    this._categories.update(categories => categories.filter((_, i) => i !== index));
  }
}
