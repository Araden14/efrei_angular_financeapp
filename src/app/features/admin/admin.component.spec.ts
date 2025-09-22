import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { AdminComponent } from './admin.component';
import { AdminService } from './admin.service';
import { CategoryService } from '../../shared/services/category.service';
import { Category } from '../../data/categories';
// PrimeNG imports
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';

describe('AdminComponent Integration Test', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;

  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', password: 'pass', role: 'user' as const, createdAt: new Date(), token: 'token1' },
    { id: 2, name: 'Jane Admin', email: 'jane@example.com', password: 'pass', role: 'admin' as const, createdAt: new Date(), token: 'token2' }
  ];

  const mockCategories: Category[] = [
    { name: 'Alimentation', icon: 'shopping_cart' },
    { name: 'Transport', icon: 'directions_car' }
  ];

  beforeEach(async () => {
    const adminSpy = jasmine.createSpyObj('AdminService', [], {
      users: signal(mockUsers)
    });

    const categorySpy = jasmine.createSpyObj('CategoryService', ['addCategory', 'updateCategory', 'deleteCategory'], {
      categories: signal(mockCategories)
    });

    await TestBed.configureTestingModule({
      imports: [
        AdminComponent,
        FormsModule,
        CardModule,
        TabsModule,
        ButtonModule,
        ChipModule,
        InputTextModule,
        DialogModule,
        TooltipModule
      ],
      providers: [
        { provide: AdminService, useValue: adminSpy },
        { provide: CategoryService, useValue: categorySpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    adminServiceSpy = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    categoryServiceSpy = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display users tab by default', () => {
    expect(component.activeTab()).toBe('users');
  });

  it('should switch to categories tab when setActiveTab is called', () => {
    component.setActiveTab('categories');
    expect(component.activeTab()).toBe('categories');
  });

  it('should add a new category successfully', () => {
    // Arrange
    const newCategory: Category = { name: 'Test Category', icon: 'test_icon' };
    component.newCategory.set(newCategory);

    // Act
    component.addCategory();

    // Assert
    expect(categoryServiceSpy.addCategory).toHaveBeenCalledWith(newCategory);
    expect(component.newCategory().name).toBe('');
    expect(component.newCategory().icon).toBe('');
    expect(component.showCategoryForm()).toBe(false);
  });

  it('should not add category with empty name or icon', () => {
    // Test with empty name
    component.newCategory.set({ name: '', icon: 'test_icon' });
    component.addCategory();
    expect(categoryServiceSpy.addCategory).not.toHaveBeenCalled();

    // Reset
    categoryServiceSpy.addCategory.calls.reset();

    // Test with empty icon
    component.newCategory.set({ name: 'Test Category', icon: '' });
    component.addCategory();
    expect(categoryServiceSpy.addCategory).not.toHaveBeenCalled();
  });

  it('should remove user when removeUser is called', () => {
    spyOn(adminServiceSpy, 'removeUser');

    component.removeUser(1);

    expect(adminServiceSpy.removeUser).toHaveBeenCalledWith(1);
  });
});
