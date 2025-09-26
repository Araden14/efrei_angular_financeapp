import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { LoginComponent } from './login';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const messageSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: MessageService, useValue: messageSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls', () => {
    expect(component.email).toBeDefined();
    expect(component.password).toBeDefined();
    expect(component.email.value).toBe('');
    expect(component.password.value).toBe('');
  });

  describe('onSubmit', () => {
    it('should not submit when email is empty', async () => {
      component.email.setValue('');
      component.password.setValue('password123');

      await component.onSubmit();

      expect(authServiceSpy.login).not.toHaveBeenCalled();
      expect(messageServiceSpy.add).not.toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should not submit when password is empty', async () => {
      component.email.setValue('test@example.com');
      component.password.setValue('');

      await component.onSubmit();

      expect(authServiceSpy.login).not.toHaveBeenCalled();
      expect(messageServiceSpy.add).not.toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should submit login successfully', async () => {
      const loginRequest = {
        email: 'admin@example.com',
        password: 'admin123'
      };

      const loginResponse = {
        success: true,
        user: {
          id: 1,
          name: 'Admin',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin' as const,
          createdAt: new Date(),
          token: 'token123'
        }
      };

      authServiceSpy.login.and.returnValue(Promise.resolve(loginResponse));

      component.email.setValue(loginRequest.email);
      component.password.setValue(loginRequest.password);

      await component.onSubmit();

      expect(authServiceSpy.login).toHaveBeenCalledWith(loginRequest);
      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Login successful'
      });
      expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    });

    it('should handle login failure', async () => {
      const loginRequest = {
        email: 'admin@example.com',
        password: 'wrongpassword'
      };

      const loginResponse = {
        success: false,
        error: 'Email ou mot de passe incorrect'
      };

      authServiceSpy.login.and.returnValue(Promise.resolve(loginResponse));

      component.email.setValue(loginRequest.email);
      component.password.setValue(loginRequest.password);

      await component.onSubmit();

      expect(authServiceSpy.login).toHaveBeenCalledWith(loginRequest);
      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Login failed'
      });
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should handle login error (exception)', async () => {
      const loginRequest = {
        email: 'admin@example.com',
        password: 'admin123'
      };

      const error = new Error('Network error');
      authServiceSpy.login.and.returnValue(Promise.reject(error));

      component.email.setValue(loginRequest.email);
      component.password.setValue(loginRequest.password);

      spyOn(console, 'error');

      await component.onSubmit();

      expect(authServiceSpy.login).toHaveBeenCalledWith(loginRequest);
      expect(console.error).toHaveBeenCalledWith('Login error:', error);
      expect(messageServiceSpy.add).not.toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should submit with both email and password provided', async () => {
      const loginRequest = {
        email: 'user@example.com',
        password: 'user123'
      };

      const loginResponse = {
        success: true,
        user: {
          id: 2,
          name: 'User',
          email: 'user@example.com',
          password: 'user123',
          role: 'user' as const,
          createdAt: new Date(),
          token: 'token456'
        }
      };

      authServiceSpy.login.and.returnValue(Promise.resolve(loginResponse));

      component.email.setValue(loginRequest.email);
      component.password.setValue(loginRequest.password);

      await component.onSubmit();

      expect(authServiceSpy.login).toHaveBeenCalledWith(loginRequest);
      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Login successful'
      });
      expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    });
  });
});
