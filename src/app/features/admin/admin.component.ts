// src/app/features/admin/admin.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar.component';
import { AdminService } from './admin.service';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { CapitalizePipe } from '../../shared/pipes/capitalize.pipe';
import { Category } from '../../data/categories';
import { CategoryService } from '../../shared/services/category.service';
import { UserService } from '../../shared/services/user.service';
import { User } from '../auth/models/user.model';
// PrimeNG imports
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { Select } from 'primeng/select';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Navbar,
    DateFormatPipe,
    CapitalizePipe,
    // PrimeNG components
    CardModule,
    TabsModule,
    ButtonModule,
    ChipModule,
    InputTextModule,
    DialogModule,
    TooltipModule,
    Select,
  ]
})
export class AdminComponent {
  private adminService = inject(AdminService);
  private categoryService = inject(CategoryService);
  private userService = inject(UserService);

  // Reactive signals
  users = this.adminService.users;
  categories = this.categoryService.categories;

  // UI state
  activeTab = signal<'users' | 'categories'>('users');
  showCategoryForm = signal(false);
  showUserForm = signal(false);
  editingCategory = signal<Category | null>(null);
  originalEditingCategory = signal<Category | null>(null);

  // Form data
  newCategory = signal<Category>({ name: '', icon: '' });
  newUser = signal<Omit<User, 'id' | 'createdAt' | 'token'>>({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  // Dropdown options
  roleOptions = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' }
  ];

  // Users methods
  removeUser(userId: number): void {
    this.adminService.removeUser(userId);
  }

  addUser(): void {
    if (this.newUser().name.trim() && this.newUser().email.trim() && this.newUser().password.trim()) {
      // Generate new user with auto-generated fields
      const user: User = {
        ...this.newUser(),
        id: Math.max(...this.users().map(u => u.id), 0) + 1, // Simple ID generation
        createdAt: new Date(),
        token: `token${Date.now()}` // Simple token generation
      };
      this.userService.addUser(user);
      this.newUser.set({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
      this.showUserForm.set(false);
    }
  }

  toggleUserForm(): void {
    this.showUserForm.set(!this.showUserForm());
    if (!this.showUserForm()) {
      this.closeUserForm();
    }
  }

  closeUserForm(): void {
    this.showUserForm.set(false);
    this.newUser.set({
      name: '',
      email: '',
      password: '',
      role: 'user'
    });
  }

  // Categories methods
  addCategory(): void {
    if (this.newCategory().name.trim() && this.newCategory().icon.trim()) {
      this.categoryService.addCategory({ ...this.newCategory() });
      this.newCategory.set({ name: '', icon: '' });
      this.showCategoryForm.set(false);
    }
  }

  editCategory(category: Category): void {
    this.originalEditingCategory.set({ ...category });
    this.editingCategory.set({ ...category });
    this.showCategoryForm.set(true);
  }

  updateCategory(): void {
    const originalCategory = this.originalEditingCategory();
    const updatedCategory = this.editingCategory();
    if (originalCategory && updatedCategory && updatedCategory.name.trim() && updatedCategory.icon.trim()) {
      this.categoryService.updateCategory(originalCategory, { ...updatedCategory });
      this.cancelEdit();
    }
  }

  removeCategory(category: Category): void {
    this.categoryService.deleteCategory(category);
  }

  cancelEdit(): void {
    this.showCategoryForm.set(false);
    this.editingCategory.set(null);
    this.originalEditingCategory.set(null);
    this.newCategory.set({ name: '', icon: '' });
  }

  // UI methods
  setActiveTab(tab: 'users' | 'categories'): void {
    this.activeTab.set(tab);
  }

  toggleCategoryForm(): void {
    this.showCategoryForm.set(!this.showCategoryForm());
    if (!this.showCategoryForm()) {
      this.cancelEdit();
    }
  }

  // Computed properties for form binding
  get currentCategoryName(): string {
    return this.editingCategory() !== null ? this.editingCategory()!.name : this.newCategory().name;
  }

  set currentCategoryName(value: string) {
    if (this.editingCategory() !== null) {
      this.editingCategory.update(cat => ({ ...cat!, name: value }));
    } else {
      this.newCategory.update(cat => ({ ...cat, name: value }));
    }
  }

  get currentCategoryIcon(): string {
    return this.editingCategory() !== null ? this.editingCategory()!.icon : this.newCategory().icon;
  }

  set currentCategoryIcon(value: string) {
    if (this.editingCategory() !== null) {
      this.editingCategory.update(cat => ({ ...cat!, icon: value }));
    } else {
      this.newCategory.update(cat => ({ ...cat, icon: value }));
    }
  }

  get currentUserName(): string {
    return this.newUser().name;
  }

  set currentUserName(value: string) {
    this.newUser.update(user => ({ ...user, name: value }));
  }

  get currentUserEmail(): string {
    return this.newUser().email;
  }

  set currentUserEmail(value: string) {
    this.newUser.update(user => ({ ...user, email: value }));
  }

  get currentUserPassword(): string {
    return this.newUser().password;
  }

  set currentUserPassword(value: string) {
    this.newUser.update(user => ({ ...user, password: value }));
  }

  get currentUserRole(): 'user' | 'admin' {
    return this.newUser().role;
  }

  set currentUserRole(value: 'user' | 'admin') {
    this.newUser.update(user => ({ ...user, role: value }));
  }
}