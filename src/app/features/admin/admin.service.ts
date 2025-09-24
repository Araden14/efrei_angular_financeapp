import { inject, Injectable, signal } from '@angular/core';
import { categories, Category } from '../../data/categories';
import { UserService } from '../../shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private  userService = inject(UserService)
  private _categories = signal([...categories]);
  
  _users = this.userService.getUsers()

  // Users
  get users() {
    return this.userService.getUsers()
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
