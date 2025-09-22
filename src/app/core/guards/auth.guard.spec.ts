import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['findUserByToken', 'setCurrentUser']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    // Mock localStorage
    localStorageSpy = jasmine.createSpyObj('Storage', ['getItem', 'setItem', 'removeItem']);

    Object.defineProperty(window, 'localStorage', {
      value: localStorageSpy,
      writable: true
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access when user is authenticated', () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      role: 'user' as const,
      createdAt: new Date(),
      token: 'valid-token'
    };

    localStorageSpy.getItem.and.returnValue('valid-token');
    authServiceSpy.findUserByToken.and.returnValue(mockUser);

    const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));

    expect(localStorageSpy.getItem).toHaveBeenCalledWith('token');
    expect(authServiceSpy.findUserByToken).toHaveBeenCalledWith('valid-token');
    expect(authServiceSpy.setCurrentUser).toHaveBeenCalledWith(mockUser);
    expect(result).toBe(true);
  });

  it('should allow access when token exists and user is found', () => {
    const mockUser = {
      id: 2,
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin' as const,
      createdAt: new Date(),
      token: 'admin-token'
    };

    localStorageSpy.getItem.and.returnValue('admin-token');
    authServiceSpy.findUserByToken.and.returnValue(mockUser);

    const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));

    expect(result).toBe(true);
    expect(authServiceSpy.setCurrentUser).toHaveBeenCalledWith(mockUser);
  });

  it('should deny access when no token exists', () => {
    localStorageSpy.getItem.and.returnValue(null);

    const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));

    expect(localStorageSpy.getItem).toHaveBeenCalledWith('token');
    expect(authServiceSpy.findUserByToken).not.toHaveBeenCalled();
    expect(authServiceSpy.setCurrentUser).not.toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(false);
  });

  it('should deny access when token exists but user is not found', () => {
    localStorageSpy.getItem.and.returnValue('invalid-token');
    authServiceSpy.findUserByToken.and.returnValue(null);

    const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));

    expect(localStorageSpy.getItem).toHaveBeenCalledWith('token');
    expect(authServiceSpy.findUserByToken).toHaveBeenCalledWith('invalid-token');
    expect(authServiceSpy.setCurrentUser).not.toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(false);
  });

  it('should deny access when token is empty string', () => {
    localStorageSpy.getItem.and.returnValue('');

    const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));

    expect(localStorageSpy.getItem).toHaveBeenCalledWith('token');
    expect(authServiceSpy.findUserByToken).not.toHaveBeenCalled();
    expect(authServiceSpy.setCurrentUser).not.toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(false);
  });

  it('should handle different route parameters', () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      role: 'user' as const,
      createdAt: new Date(),
      token: 'valid-token'
    };

    localStorageSpy.getItem.and.returnValue('valid-token');
    authServiceSpy.findUserByToken.and.returnValue(mockUser);

    const mockRoute = { params: { id: '123' } };
    const mockState = { url: '/protected' };

    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute as any, mockState as any)
    );

    expect(result).toBe(true);
    expect(authServiceSpy.setCurrentUser).toHaveBeenCalledWith(mockUser);
  });
});
