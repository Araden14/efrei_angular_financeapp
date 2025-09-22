import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', [], {
      currentUser$: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        role: 'user' as const,
        createdAt: new Date(),
        token: 'user-token'
      }
    });
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access when user is admin', () => {
    // Mock admin user
    const adminUser = {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin' as const,
      createdAt: new Date(),
      token: 'admin-token'
    };

    Object.defineProperty(authServiceSpy, 'currentUser$', {
      value: adminUser,
      writable: true
    });

    const result = TestBed.runInInjectionContext(() => adminGuard(null as any, null as any));

    expect(result).toBe(true);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should deny access when user is not admin', () => {
    // Mock regular user
    const regularUser = {
      id: 2,
      name: 'Regular User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user' as const,
      createdAt: new Date(),
      token: 'user-token'
    };

    Object.defineProperty(authServiceSpy, 'currentUser$', {
      value: regularUser,
      writable: true
    });

    const result = TestBed.runInInjectionContext(() => adminGuard(null as any, null as any));

    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/todos']);
  });

  it('should deny access when currentUser$ is null', () => {
    Object.defineProperty(authServiceSpy, 'currentUser$', {
      value: null,
      writable: true
    });

    const result = TestBed.runInInjectionContext(() => adminGuard(null as any, null as any));

    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/todos']);
  });

  it('should deny access when currentUser$ is undefined', () => {
    Object.defineProperty(authServiceSpy, 'currentUser$', {
      value: undefined,
      writable: true
    });

    const result = TestBed.runInInjectionContext(() => adminGuard(null as any, null as any));

    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/todos']);
  });

  it('should handle different route parameters', () => {
    // Mock admin user
    const adminUser = {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin' as const,
      createdAt: new Date(),
      token: 'admin-token'
    };

    Object.defineProperty(authServiceSpy, 'currentUser$', {
      value: adminUser,
      writable: true
    });

    const mockRoute = { params: { id: '123' } };
    const mockState = { url: '/admin/users' };

    const result = TestBed.runInInjectionContext(() =>
      adminGuard(mockRoute as any, mockState as any)
    );

    expect(result).toBe(true);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should deny access for regular user with different route', () => {
    // Mock regular user
    const regularUser = {
      id: 2,
      name: 'Regular User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user' as const,
      createdAt: new Date(),
      token: 'user-token'
    };

    Object.defineProperty(authServiceSpy, 'currentUser$', {
      value: regularUser,
      writable: true
    });

    const mockRoute = { params: { id: '123' } };
    const mockState = { url: '/admin/users' };

    const result = TestBed.runInInjectionContext(() =>
      adminGuard(mockRoute as any, mockState as any)
    );

    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/todos']);
  });
});
