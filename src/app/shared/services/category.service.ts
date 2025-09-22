import { Injectable, signal } from '@angular/core';
import { categories, Category } from '../../data/categories';

@Injectable({
  providedIn: 'root' })
export class CategoryService {
categories = signal<Category[]>(categories);


  getCategories() {
  return this.categories()
  }

  addCategory(category: Category) {
    this.categories.update(categories => [...categories, category]);
  }

  updateCategory(originalCategory: Category, updatedCategory: Category) {
    this.categories.update(categories => categories.map(c => c.name === originalCategory.name ? updatedCategory : c));
  }

  deleteCategory(category: Category) {
    this.categories.update(categories => categories.filter(c => c.name !== category.name));
  }
}
