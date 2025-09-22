// src/app/features/admin/admin.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar.component';
import { AdminService } from './admin.service';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { CategoryIconPipe } from '../../shared/pipes/category-icon.pipe';
import { CapitalizePipe } from '../../shared/pipes/capitalize.pipe';
import { ConfirmDirective } from '../../shared/directives/confirm.directive';
import { Category } from '../../data/categories';
import { CategoryService } from '../../shared/services/category.service';

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
    CategoryIconPipe,
    CapitalizePipe,
    ConfirmDirective
  ]
})
export class AdminComponent {
  private adminService = inject(AdminService);
  private categoryService = inject(CategoryService)

  // Reactive signals
  users = this.adminService.users;
  categories = this.categoryService.categories;

  // UI state
  activeTab = signal<'users' | 'categories'>('users');
  showCategoryForm = signal(false);
  editingCategory = signal<Category | null>(null);
  originalEditingCategory = signal<Category | null>(null);

  // Form data
  newCategory = signal<Category>({ name: '', icon: '' });

  // Users methods
  removeUser(userId: number): void {
    this.adminService.removeUser(userId);
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
}